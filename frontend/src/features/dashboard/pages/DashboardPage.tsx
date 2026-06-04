import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, type CashFlowData } from '../api/dashboardApi';
import { StatCard } from '../components/StatCard';
import { CashFlowChart } from '../components/CashFlowChart';
import { RecentTransactionsTable } from '../components/RecentTransactionsTable';
import { BalanceCard } from '../components/BalanceCard';
import { MyAccountsSection } from '../components/MyAccountsSection';
import { TransactionFilterModal, type FilterOptions } from '../components/TransactionFilterModal';
import { DashboardSkeleton } from '../../../components/common/Skeletons';
import { ErrorState } from '../../../components/common/ErrorState';
import type { ActionType } from '../components/QuickActionButtons';
import { ROUTES } from '../../../lib/constants';
import { useSettings } from '../../../contexts/SettingsContext';
import { useFormatters } from '../../../hooks/useFormatters';
import { getDashboardMessages, getDashboardMonthLabel } from '../lib/dashboardLocale';

const DashboardPage = () => {
  const navigate = useNavigate();
  const { settings } = useSettings();
  const { formatCurrency } = useFormatters();
  const messages = getDashboardMessages(settings.locale);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);

  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: dashboardApi.getStats,
  });

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (isError || !stats) {
    return (
      <ErrorState
        title={messages.dashboardLoadErrorTitle}
        message={messages.dashboardLoadErrorMessage}
        onRetry={() => refetch()}
      />
    );
  }

  // Transform monthlyTrend to cashFlow format
  const cashFlowData: CashFlowData[] = stats.monthlyTrend.map((trend) => {
    return {
      month: getDashboardMonthLabel(trend.month, settings.locale),
      cashIn: trend.income,
      cashOut: trend.expenses,
    };
  });

  // Calculate real trends (current month vs previous month)
  const calculateTrend = (currentValue: number, previousValue: number) => {
    if (previousValue === 0) {
      return { value: 0, isPositive: currentValue > 0 };
    }
    const percentChange = ((currentValue - previousValue) / previousValue) * 100;
    return {
      value: Math.abs(percentChange),
      isPositive: percentChange > 0,
    };
  };

  // Get current and previous month data
  const currentMonthIndex = stats.monthlyTrend.length - 1;
  const previousMonthIndex = currentMonthIndex - 1;

  const currentMonth = stats.monthlyTrend[currentMonthIndex] || { income: 0, expenses: 0 };
  const previousMonth = stats.monthlyTrend[previousMonthIndex] || { income: 0, expenses: 0 };

  const incomeTrend = calculateTrend(currentMonth.income, previousMonth.income);
  const expenseTrend = calculateTrend(currentMonth.expenses, previousMonth.expenses);

  // Balance trend based on net flow (income - expenses)
  const currentNetFlow = currentMonth.income - currentMonth.expenses;
  const previousNetFlow = previousMonth.income - previousMonth.expenses;
  const balanceTrend = calculateTrend(currentNetFlow, previousNetFlow);

  // Generate subtexts based on actual values
  const incomeDiff = currentMonth.income - previousMonth.income;
  const expenseDiff = currentMonth.expenses - previousMonth.expenses;
  const balanceDiff = currentNetFlow - previousNetFlow;

  const incomeSubtext = incomeDiff > 0
    ? messages.incomeExtraThisMonth(formatCurrency(incomeDiff))
    : incomeDiff < 0
      ? messages.incomeLessThisMonth(formatCurrency(Math.abs(incomeDiff)))
      : messages.sameAsLastMonth;

  const expenseSubtext = expenseDiff > 0
    ? messages.expenseMoreThisMonth(formatCurrency(expenseDiff))
    : expenseDiff < 0
      ? messages.expenseSavedThisMonth(formatCurrency(Math.abs(expenseDiff)))
      : messages.sameAsLastMonth;

  const balanceSubtext = balanceDiff > 0
    ? messages.balanceIncreasedBy(formatCurrency(balanceDiff))
    : balanceDiff < 0
      ? messages.balanceDecreasedBy(formatCurrency(Math.abs(balanceDiff)))
      : messages.noChangeFromLastMonth;

  const handleCardAction = (action: ActionType) => {
    switch (action) {
      case 'convert':
        navigate(ROUTES.REPORTS);
        break;
      case 'send':
        navigate(`${ROUTES.TRANSACTIONS}?paymentType=TRANSFER`);
        break;
      case 'receive':
        navigate(`${ROUTES.TRANSACTIONS}?status=PAID`);
        break;
      case 'more':
      default:
        navigate(ROUTES.TRANSACTIONS);
        break;
    }
  };

  const handleAddAccount = () => {
    navigate(ROUTES.ACCOUNTS);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = (filters: FilterOptions) => {
    setActiveFilters(filters);

    const params = new URLSearchParams();
    if (filters.dateRange.from) params.set('startDate', filters.dateRange.from);
    if (filters.dateRange.to) params.set('endDate', filters.dateRange.to);
    if (filters.status.length > 0) {
      const normalizedStatus = filters.status[0].toUpperCase();
      if (['PENDING', 'PAID', 'CANCELLED'].includes(normalizedStatus)) {
        params.set('status', normalizedStatus);
      }
    }

    const query = params.toString();
    navigate(`${ROUTES.TRANSACTIONS}${query ? `?${query}` : ''}`);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Summary Cards - 3 cards in top row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title={messages.income}
          value={stats.summary.totalIncome}
          type="income"
          trend={incomeTrend}
          subtext={incomeSubtext}
        />
        <StatCard
          title={messages.expense}
          value={stats.summary.totalExpenses}
          type="expense"
          trend={expenseTrend}
          subtext={expenseSubtext}
        />
        <BalanceCard
          balance={stats.summary.totalBalance}
          change={balanceTrend}
          chartData={stats.balanceHistory}
          subtext={balanceSubtext}
        />
      </div>

      {/* Cash Flow Chart and My Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Cash Flow Chart - 8 columns */}
        <div className="lg:col-span-8 flex">
          <CashFlowChart data={cashFlowData} />
        </div>

        {/* My Accounts - 4 columns */}
        <div className="lg:col-span-4 flex">
          <MyAccountsSection
            accounts={stats.cards}
            onAddAccount={handleAddAccount}
            onAction={handleCardAction}
          />
        </div>
      </div>

      {/* Recent Transactions - Full Width */}
      <RecentTransactionsTable
        transactions={stats.recentTransactions}
        onFilter={handleFilter}
      />


      {/* Transaction Filter Modal */}
      <TransactionFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={activeFilters || undefined}
      />
    </div>
  );
};

export default DashboardPage;
