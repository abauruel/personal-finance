import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { CreateCategoryDto, UpdateCategoryDto } from './dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(userId: string) {
    return this.prisma.category.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findOne(id: string, userId: string) {
    const category = await this.prisma.category.findFirst({
      where: { id, userId },
    });

    if (!category) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return category;
  }

  async create(userId: string, dto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: {
        userId,
        name: dto.name,
        icon: dto.icon,
        color: dto.color,
        isDefault: false,
      },
    });
  }

  async update(id: string, userId: string, dto: UpdateCategoryDto) {
    const category = await this.findOne(id, userId);

    // Não permitir alterar categorias padrão (apenas criadas pelo usuário)
    if (category.isDefault) {
      throw new BadRequestException('Não é possível alterar categorias padrão');
    }

    return this.prisma.category.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string) {
    const category = await this.findOne(id, userId);

    // Não permitir deletar categorias padrão
    if (category.isDefault) {
      throw new BadRequestException('Não é possível deletar categorias padrão');
    }

    return this.prisma.category.delete({
      where: { id },
    });
  }
}
