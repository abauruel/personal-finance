import api from '../../../lib/api';

export interface DashboardStats {
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
}

export const dashboardApi = {
  getStats: async (): Promise<DashboardStats> => {
    const response = await api.get<DashboardStats>('/dashboard/stats');
    return response.data;
  },
};
