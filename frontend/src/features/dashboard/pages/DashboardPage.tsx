import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import { StatCard } from '../components/StatCard';
import { CategoryChart } from '../components/CategoryChart';
import { TrendChart } from '../components/TrendChart';
import { RecentTransactions } from '../components/RecentTransactions';

const DashboardPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Carregando dashboard...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Erro ao carregar dados</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Saldo Total"
          value={stats.summary.totalBalance}
          type="balance"
        />
        <StatCard
          title="Receitas"
          value={stats.summary.totalIncome}
          type="income"
        />
        <StatCard
          title="Despesas"
          value={stats.summary.totalExpenses}
          type="expense"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryChart data={stats.categoryExpenses} />
        <TrendChart data={stats.monthlyTrend} />
      </div>

      {/* Recent Transactions */}
      <RecentTransactions transactions={stats.recentTransactions} />
    </div>
  );
};

export default DashboardPage;
