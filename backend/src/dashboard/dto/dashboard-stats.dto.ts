export interface DashboardStatsDto {
  summary: {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
  };
  categoryExpenses: Array<{
    categoryId: string;
    categoryName: string;
    icon: string;
    color: string;
    total: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
  recentTransactions: Array<{
    id: string;
    date: Date;
    description: string;
    amount: number;
    category: {
      name: string;
      icon: string;
    };
    account: {
      name: string;
    };
  }>;
  balanceHistory: Array<{
    date: string;
    value: number;
  }>;
  cards: Array<{
    id: string;
    name: string;
    type: string;
    color: string;
    balance: number;
  }>;
}
