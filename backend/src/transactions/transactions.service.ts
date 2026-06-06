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
      where.date = {};
      if (filters.startDate) {
        where.date.gte = new Date(filters.startDate);
      }
      if (filters.endDate) {
        where.date.lte = new Date(filters.endDate);
      }
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
          select: { id: true, name: true, type: true },
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
          select: { id: true, name: true, type: true },
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
    const normalizedAmount = this.normalizeAmount(dto.amount, dto.transactionType);

    // Criar a transação
    const transaction = await this.prisma.transaction.create({
      data: {
        userId,
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        date: new Date(dto.date),
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
          select: { id: true, name: true, type: true },
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
    const normalizedAmount = dto.amount === undefined
      ? undefined
      : this.normalizeAmount(dto.amount, dto.transactionType);

    // Atualizar a transação
    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        accountId: dto.accountId,
        categoryId: dto.categoryId,
        date: dto.date ? new Date(dto.date) : undefined,
        amount: normalizedAmount,
        description: dto.description,
        paymentType: dto.paymentType,
        status: dto.status,
        notes: dto.notes,
      },
      include: {
        account: {
          select: { id: true, name: true, type: true },
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
}
