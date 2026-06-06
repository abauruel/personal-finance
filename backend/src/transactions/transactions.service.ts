import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateTransactionDto, UpdateTransactionDto } from './dto';

interface FindAllFilters {
  search?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  status?: string;
  paymentType?: string;
}

@Injectable()
export class TransactionsService {
  constructor(private readonly prisma: PrismaService) { }

  async findAll(userId: string, filters: FindAllFilters = {}) {
    const where: any = { userId };

    // Filtro por busca (descrição ou notes)
    if (filters.search) {
      where.OR = [
        { description: { contains: filters.search, mode: 'insensitive' } },
        { notes: { contains: filters.search, mode: 'insensitive' } },
      ];
    }

    // Filtro por intervalo de datas
    if (filters.startDate || filters.endDate) {
      const dateRange: any = {};
      if (filters.startDate) {
        dateRange.gte = this.parseDateOnly(filters.startDate);
      }
      if (filters.endDate) {
        dateRange.lte = this.parseDateOnly(filters.endDate);
      }

      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { competenceDate: dateRange },
          {
            AND: [
              { competenceDate: null },
              { date: dateRange },
            ],
          },
        ],
      });
    }

    // Outros filtros
    if (filters.categoryId) {
      where.categoryId = filters.categoryId;
    }
    if (filters.accountId) {
      where.accountId = filters.accountId;
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.paymentType) {
      where.paymentType = filters.paymentType;
    }

    return this.prisma.transaction.findMany({
      where,
      include: {
        account: {
          select: { id: true, name: true, type: true, closingDay: true, dueDay: true },
        },
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: {
          select: { id: true, name: true, type: true, closingDay: true, dueDay: true },
        },
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async create(userId: string, dto: CreateTransactionDto) {
    const account = await this.prisma.account.findFirst({
      where: { id: dto.accountId, userId },
      select: { type: true, closingDay: true },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    const transactionDate = this.parseDateOnly(dto.date);
    const normalizedAmount = this.normalizeAmount(dto.amount, dto.transactionType);
    const competenceDate = dto.competenceDate
      ? this.normalizeCompetenceDate(this.parseDateOnly(dto.competenceDate))
      : this.computeCompetenceDate(transactionDate, normalizedAmount, account);

    // Criar a transação
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        date: transactionDate,
        competenceDate,
        amount: normalizedAmount,
        description: dto.description,
        paymentType: dto.paymentType,
        status: dto.status || 'PENDING',
        notes: dto.notes,
        isRecurring: dto.isRecurring || false,
        recurringId: dto.recurringId,
      },
      include: {
        account: {
          select: { id: true, name: true, type: true, closingDay: true, dueDay: true },
        },
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    // Atualizar saldo da conta se a transação estiver paga
    if (transaction.status === 'PAID') {
      await this.updateAccountBalance(dto.accountId);
    }

    return transaction;
  }

  async update(id: string, userId: string, dto: UpdateTransactionDto) {
    const existingTransaction = await this.findOne(id, userId);
    const oldAccountId = existingTransaction.accountId;
    const oldStatus = existingTransaction.status;
    const nextAccountId = dto.accountId ?? existingTransaction.accountId;
    const nextDate = dto.date
      ? this.parseDateOnly(dto.date)
      : new Date(
        existingTransaction.date.getFullYear(),
        existingTransaction.date.getMonth(),
        existingTransaction.date.getDate(),
      );
    const nextAmount = dto.amount ?? existingTransaction.amount;
    const nextTransactionType = dto.transactionType
      ?? (nextAmount < 0 ? 'EXPENSE' : 'INCOME');
    const normalizedAmount = this.normalizeAmount(nextAmount, nextTransactionType);

    const account = await this.prisma.account.findFirst({
      where: { id: nextAccountId, userId },
      select: { type: true, closingDay: true },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    const competenceDate = dto.competenceDate
      ? this.normalizeCompetenceDate(this.parseDateOnly(dto.competenceDate))
      : this.computeCompetenceDate(nextDate, normalizedAmount, account);

    // Atualizar a transação
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        date: dto.date ? nextDate : undefined,
        competenceDate,
        amount: normalizedAmount,
        description: dto.description,
        paymentType: dto.paymentType,
        status: dto.status,
        notes: dto.notes,
      },
      include: {
        account: {
          select: { id: true, name: true, type: true, closingDay: true, dueDay: true },
        },
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    // Atualizar saldo das contas afetadas
    const accountsToUpdate = new Set<string>();

    // Se mudou de conta, atualizar ambas
    if (dto.accountId && dto.accountId !== oldAccountId) {
      accountsToUpdate.add(oldAccountId);
      accountsToUpdate.add(dto.accountId);
    } else {
      accountsToUpdate.add(oldAccountId);
    }

    // Se mudou o status para/de PAID, atualizar saldo
    if (
      (oldStatus !== 'PAID' && transaction.status === 'PAID') ||
      (oldStatus === 'PAID' && transaction.status !== 'PAID') ||
      (oldStatus === 'PAID' && transaction.status === 'PAID')
    ) {
      for (const accountId of accountsToUpdate) {
        await this.updateAccountBalance(accountId);
      }
    }

    return transaction;
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    await this.prisma.transaction.delete({
      where: { id },
    });

    // Atualizar saldo da conta se a transação estava paga
    if (transaction.status === 'PAID') {
      await this.updateAccountBalance(transaction.accountId);
    }

    return transaction;
  }

  /**
   * Recalcula o saldo atual da conta baseado no saldo inicial + transações pagas
   */
  private async updateAccountBalance(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      select: { initialBalance: true },
    });

    if (!account) return;

    // Somar todas as transações PAID da conta
    const transactions = await this.prisma.transaction.findMany({
      where: {
        accountId,
        status: 'PAID',
      },
      select: { amount: true },
    });

    const totalTransactions = transactions.reduce(
      (sum, t) => sum + t.amount,
      0,
    );

    const newBalance = account.initialBalance + totalTransactions;

    await this.prisma.account.update({
      where: { id: accountId },
      data: { currentBalance: newBalance },
    });
  }

  private normalizeAmount(
    amount: number,
    transactionType?: 'EXPENSE' | 'INCOME',
  ): number {
    const absAmount = Math.abs(amount);

    if (transactionType === 'INCOME') {
      return absAmount;
    }

    if (transactionType === 'EXPENSE') {
      return -absAmount;
    }

    return amount;
  }

  private computeCompetenceDate(
    transactionDate: Date,
    normalizedAmount: number,
    account: { type: string; closingDay: number | null },
  ) {
    const baseDate = this.normalizeCompetenceDate(transactionDate);

    if (account.type !== 'CREDIT_CARD' || normalizedAmount >= 0) {
      return baseDate;
    }

    const closingDay = account.closingDay;
    if (!closingDay) {
      return baseDate;
    }

    const competenceDate = new Date(baseDate);
    const purchaseDay = transactionDate.getDate();

    if (purchaseDay > closingDay) {
      competenceDate.setMonth(competenceDate.getMonth() + 1);
    }

    return competenceDate;
  }

  private normalizeCompetenceDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  private parseDateOnly(value: string) {
    const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (match) {
      const [, year, month, day] = match;
      return new Date(Number(year), Number(month) - 1, Number(day));
    }

    return new Date(value);
  }
}
