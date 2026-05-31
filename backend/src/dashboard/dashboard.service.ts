import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { DashboardStatsDto } from './dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) { }

  async getStats(userId: string): Promise<DashboardStatsDto> {
    // Buscar todas as contas do usuário
    const accounts = await this.prisma.account.findMany({
      where: { userId },
      select: { currentBalance: true },
    });

    const totalBalance = accounts.reduce(
      (sum, acc) => sum + acc.currentBalance,
      0,
    );

    // Buscar transações pagas para calcular income e expenses
    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        status: 'PAID',
      },
      include: {
        category: {
          select: { id: true, name: true, icon: true, color: true },
        },
        account: {
          select: { name: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    // Calcular income e expenses
    const totalIncome = transactions
      .filter((t) => t.amount > 0)
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = Math.abs(
      transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0),
    );

    // Gastos por categoria (apenas despesas)
    const categoryMap = new Map<
      string,
      {
        categoryId: string;
        categoryName: string;
        icon: string;
        color: string;
        total: number;
      }
    >();

    transactions
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        if (t.category) {
          const existing = categoryMap.get(t.categoryId);
          if (existing) {
            existing.total += Math.abs(t.amount);
          } else {
            categoryMap.set(t.categoryId, {
              categoryId: t.categoryId,
              categoryName: t.category.name,
              icon: t.category.icon,
              color: t.category.color,
              total: Math.abs(t.amount),
            });
          }
        }
      });

    const categoryExpenses = Array.from(categoryMap.values()).sort(
      (a, b) => b.total - a.total,
    );

    // Tendência mensal (últimos 6 meses)
    const monthlyTrend = this.calculateMonthlyTrend(transactions);

    // Transações recentes (últimas 10)
    const recentTransactions = transactions.slice(0, 10).map((t) => ({
      id: t.id,
      date: t.date,
      description: t.description,
      amount: t.amount,
      category: {
        name: t.category?.name || 'Sem categoria',
        icon: t.category?.icon || '📝',
      },
      account: {
        name: t.account?.name || 'Sem conta',
      },
    }));

    // Balance history (últimos 6 meses)
    const balanceHistory = this.calculateBalanceHistory(monthlyTrend, totalBalance);

    // Cards (contas do usuário)
    const cards = await this.prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        type: true,
        currentBalance: true,
      },
      take: 3, // Mostrar apenas 3 cards principais
      orderBy: { currentBalance: 'desc' },
    });

    return {
      summary: {
        totalBalance,
        totalIncome,
        totalExpenses,
      },
      categoryExpenses,
      monthlyTrend,
      recentTransactions,
      balanceHistory,
      cards: cards.map((card) => ({
        id: card.id,
        name: card.name,
        type: card.type,
        balance: card.currentBalance,
      })),
    };
  }

  private calculateMonthlyTrend(transactions: any[]): Array<{
    month: string;
    income: number;
    expenses: number;
  }> {
    const now = new Date();
    const monthsMap = new Map<string, { income: number; expenses: number }>();

    // Inicializar últimos 6 meses
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthsMap.set(key, { income: 0, expenses: 0 });
    }

    // Agrupar transações por mês
    transactions.forEach((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (monthsMap.has(key)) {
        const data = monthsMap.get(key)!;
        if (t.amount > 0) {
          data.income += t.amount;
        } else {
          data.expenses += Math.abs(t.amount);
        }
      }
    });

    // Converter para array ordenado
    return Array.from(monthsMap.entries()).map(([month, data]) => ({
      month,
      income: data.income,
      expenses: data.expenses,
    }));
  }

  private calculateBalanceHistory(
    monthlyTrend: Array<{ month: string; income: number; expenses: number }>,
    currentBalance: number,
  ): Array<{ date: string; value: number }> {
    // Começar do saldo atual e voltar no tempo subtraindo o net flow de cada mês
    const history: Array<{ date: string; value: number }> = [];
    let runningBalance = currentBalance;

    // Processar do mês mais recente para o mais antigo
    for (let i = monthlyTrend.length - 1; i >= 0; i--) {
      const trend = monthlyTrend[i];
      history.unshift({
        date: trend.month,
        value: runningBalance,
      });
      // Subtrair o net flow deste mês para obter o saldo do mês anterior
      const netFlow = trend.income - trend.expenses;
      runningBalance -= netFlow;
    }

    return history;
  }
}
