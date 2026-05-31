import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecurringDto } from './dto/create-recurring.dto';
import { UpdateRecurringDto } from './dto/update-recurring.dto';
import type { RecurringResponseDto } from './dto/recurring-response.dto';

@Injectable()
export class RecurringService {
  constructor(private readonly prisma: PrismaService) { }

  async create(
    userId: string,
    createDto: CreateRecurringDto,
  ): Promise<RecurringResponseDto> {
    // Validar se categoria pertence ao usuário
    const category = await this.prisma.category.findFirst({
      where: { id: createDto.categoryId, userId },
    });

    if (!category) {
      throw new BadRequestException('Category not found or does not belong to user');
    }

    // Validar se conta pertence ao usuário
    const account = await this.prisma.account.findFirst({
      where: { id: createDto.accountId, userId },
    });

    if (!account) {
      throw new BadRequestException('Account not found or does not belong to user');
    }

    // Validar datas
    const startDate = new Date(createDto.startDate);
    const endDate = createDto.endDate ? new Date(createDto.endDate) : null;

    if (endDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Validar dayOfMonth baseado na frequência
    if (createDto.frequency === 'MONTHLY' && (createDto.dayOfMonth < 1 || createDto.dayOfMonth > 31)) {
      throw new BadRequestException('Day of month must be between 1 and 31 for monthly frequency');
    }

    // Criar despesa recorrente
    const recurring = await this.prisma.recurringTransaction.create({
      data: {
        userId,
        categoryId: createDto.categoryId,
        accountId: createDto.accountId,
        description: createDto.description,
        amount: createDto.amount,
        frequency: createDto.frequency,
        paymentType: createDto.paymentType || 'DEBIT',
        dayOfMonth: createDto.dayOfMonth,
        startDate,
        endDate,
        active: createDto.active !== undefined ? createDto.active : true,
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    // Buscar account separadamente (não há relação no Prisma)
    const accountData = await this.prisma.account.findUnique({
      where: { id: createDto.accountId },
      select: { id: true, name: true, type: true },
    });

    return this.mapToResponseDto(recurring, accountData);
  }

  async findAll(userId: string): Promise<RecurringResponseDto[]> {
    const recurrings = await this.prisma.recurringTransaction.findMany({
      where: { userId },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
      orderBy: [
        { active: 'desc' },
        { dayOfMonth: 'asc' },
      ],
    });

    // Buscar accounts separadamente
    const accountIds = [...new Set(recurrings.map(r => r.accountId))];
    const accounts = await this.prisma.account.findMany({
      where: { id: { in: accountIds } },
      select: { id: true, name: true, type: true },
    });
    const accountMap = new Map(accounts.map(a => [a.id, a]));

    return recurrings.map((r) => this.mapToResponseDto(r, accountMap.get(r.accountId)));
  }

  async findOne(userId: string, id: string): Promise<RecurringResponseDto> {
    const recurring = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    if (!recurring) {
      throw new NotFoundException('Recurring transaction not found');
    }

    // Buscar account separadamente
    const accountData = await this.prisma.account.findUnique({
      where: { id: recurring.accountId },
      select: { id: true, name: true, type: true },
    });

    return this.mapToResponseDto(recurring, accountData);
  }

  async update(
    userId: string,
    id: string,
    updateDto: UpdateRecurringDto,
  ): Promise<RecurringResponseDto> {
    // Verificar se existe e pertence ao usuário
    const existing = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Recurring transaction not found');
    }

    // Validar categoria se foi alterada
    if (updateDto.categoryId) {
      const category = await this.prisma.category.findFirst({
        where: { id: updateDto.categoryId, userId },
      });
      if (!category) {
        throw new BadRequestException('Category not found or does not belong to user');
      }
    }

    // Validar conta se foi alterada
    if (updateDto.accountId) {
      const account = await this.prisma.account.findFirst({
        where: { id: updateDto.accountId, userId },
      });
      if (!account) {
        throw new BadRequestException('Account not found or does not belong to user');
      }
    }

    // Validar datas se foram alteradas
    const startDate = updateDto.startDate ? new Date(updateDto.startDate) : existing.startDate;
    const endDate = updateDto.endDate ? new Date(updateDto.endDate) : existing.endDate;

    if (endDate && endDate <= startDate) {
      throw new BadRequestException('End date must be after start date');
    }

    // Atualizar
    const updated = await this.prisma.recurringTransaction.update({
      where: { id },
      data: {
        ...(updateDto.categoryId && { categoryId: updateDto.categoryId }),
        ...(updateDto.accountId && { accountId: updateDto.accountId }),
        ...(updateDto.description && { description: updateDto.description }),
        ...(updateDto.amount !== undefined && { amount: updateDto.amount }),
        ...(updateDto.frequency && { frequency: updateDto.frequency }),
        ...(updateDto.paymentType && { paymentType: updateDto.paymentType }),
        ...(updateDto.dayOfMonth !== undefined && { dayOfMonth: updateDto.dayOfMonth }),
        ...(updateDto.startDate && { startDate: new Date(updateDto.startDate) }),
        ...(updateDto.endDate !== undefined && {
          endDate: updateDto.endDate ? new Date(updateDto.endDate) : null
        }),
        ...(updateDto.active !== undefined && { active: updateDto.active }),
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    // Buscar account separadamente
    const accountData = await this.prisma.account.findUnique({
      where: { id: updated.accountId },
      select: { id: true, name: true, type: true },
    });

    return this.mapToResponseDto(updated, accountData);
  }

  async toggleActive(userId: string, id: string): Promise<RecurringResponseDto> {
    const existing = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Recurring transaction not found');
    }

    const updated = await this.prisma.recurringTransaction.update({
      where: { id },
      data: { active: !existing.active },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
      },
    });

    // Buscar account separadamente
    const accountData = await this.prisma.account.findUnique({
      where: { id: updated.accountId },
      select: { id: true, name: true, type: true },
    });

    return this.mapToResponseDto(updated, accountData);
  }

  async remove(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Recurring transaction not found');
    }

    // Soft delete - apenas marcar como inativo
    await this.prisma.recurringTransaction.update({
      where: { id },
      data: { active: false },
    });
  }

  async hardDelete(userId: string, id: string): Promise<void> {
    const existing = await this.prisma.recurringTransaction.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      throw new NotFoundException('Recurring transaction not found');
    }

    // Hard delete - remover completamente
    await this.prisma.recurringTransaction.delete({
      where: { id },
    });
  }

  private mapToResponseDto(recurring: any, account?: any): RecurringResponseDto {
    return {
      id: recurring.id,
      userId: recurring.userId,
      categoryId: recurring.categoryId,
      accountId: recurring.accountId,
      description: recurring.description,
      amount: recurring.amount,
      frequency: recurring.frequency,
      paymentType: recurring.paymentType,
      dayOfMonth: recurring.dayOfMonth,
      startDate: recurring.startDate,
      endDate: recurring.endDate,
      active: recurring.active,
      lastGenerated: recurring.lastGenerated,
      createdAt: recurring.createdAt,
      updatedAt: recurring.updatedAt,
      ...(recurring.category && {
        category: {
          id: recurring.category.id,
          name: recurring.category.name,
          icon: recurring.category.icon,
          color: recurring.category.color,
        },
      }),
      ...(account && {
        account: {
          id: account.id,
          name: account.name,
          type: account.type,
        },
      }),
    };
  }
}
