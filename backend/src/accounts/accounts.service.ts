import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateAccountDto, UpdateAccountDto } from './dto';

@Injectable()
export class AccountsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.account.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string) {
    const account = await this.prisma.account.findFirst({
      where: { id, userId },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    return account;
  }

  async create(userId: string, dto: CreateAccountDto) {
    const initialBalance = dto.initialBalance ?? 0;
    return this.prisma.account.create({
      data: {
        userId,
        name: dto.name,
        type: dto.type,
        initialBalance,
        currentBalance: initialBalance,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateAccountDto) {
    await this.findOne(id, userId);

    return this.prisma.account.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    await this.findOne(id, userId);

    return this.prisma.account.delete({
      where: { id },
    });
  }
}
