import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { dashboardApi, type CashFlowData } from '../api/dashboardApi';
import { StatCard } from '../components/StatCard';
import { CashFlowChart } from '../components/CashFlowChart';
import { RecentTransactionsTable } from '../components/RecentTransactionsTable';
import { BalanceCard } from '../components/BalanceCard';
import { MyAccountsSection } from '../components/MyAccountsSection';
import { CategorySummary } from '../components/CategorySummary';
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
  const now = new Date();
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<FilterOptions | null>(null);
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

  const { data: stats, isLoading, isError, refetch } = useQuery({
    queryKey: ['dashboard-stats', selectedYear, selectedMonth],
    queryFn: () => dashboardApi.getStats({ month: selectedMonth, year: selectedYear }),
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

  // Calculate real trends (selected month vs previous month)
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

  const selectedMonthKey = `${selectedYear}-${String(selectedMonth).padStart(2, '0')}`;

  const previousMonthDate = new Date(selectedYear, selectedMonth - 2, 1);
  const previousMonthKey = `${previousMonthDate.getFullYear()}-${String(previousMonthDate.getMonth() + 1).padStart(2, '0')}`;

  const selectedMonthData = stats.monthlyTrend.find((trend) => trend.month === selectedMonthKey) || {
    income: 0,
    expenses: 0,
  };

  const previousMonthData = stats.monthlyTrend.find((trend) => trend.month === previousMonthKey) || {
    income: 0,
    expenses: 0,
  };

  const availableYears = Array.from(
    new Set([...stats.monthlyTrend.map((trend) => Number(trend.month.split('-')[0])), selectedYear])
  ).sort((a, b) => b - a);

  const monthOptions = Array.from({ length: 12 }, (_, index) => {
    const monthNumber = index + 1;
    const date = new Date(2000, index, 1);
    const label = new Intl.DateTimeFormat(settings.locale, { month: 'long' }).format(date);

    return {
      value: monthNumber,
      label: label.charAt(0).toUpperCase() + label.slice(1),
    };
  });

  const summaryIncome = selectedMonthData.income;
  const summaryExpenses = selectedMonthData.expenses;

  const incomeTrend = calculateTrend(selectedMonthData.income, previousMonthData.income);
  const expenseTrend = calculateTrend(selectedMonthData.expenses, previousMonthData.expenses);

  // Balance trend based on net flow (income - expenses)
  const currentNetFlow = selectedMonthData.income - selectedMonthData.expenses;
  const previousNetFlow = previousMonthData.income - previousMonthData.expenses;
  const balanceTrend = calculateTrend(currentNetFlow, previousNetFlow);

  // Generate subtexts based on actual values
  const incomeDiff = selectedMonthData.income - previousMonthData.income;
  const expenseDiff = selectedMonthData.expenses - previousMonthData.expenses;
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
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="bg-white rounded-xl p-4 shadow-card border border-gray-100 flex flex-wrap items-end gap-3 sm:gap-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mes</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Ano</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition"
          >
            {availableYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Summary Cards - 3 cards in top row */}
      <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title={messages.income}
          value={summaryIncome}
          type="income"
          trend={incomeTrend}
          subtext={incomeSubtext}
        />
        <StatCard
          title={messages.expense}
          value={summaryExpenses}
          type="expense"
          trend={expenseTrend}
          subtext={expenseSubtext}
        />
        <div className="md:col-span-2 2xl:col-span-1">
          <BalanceCard
            balance={stats.summary.totalBalance}
            change={balanceTrend}
            chartData={stats.balanceHistory}
            subtext={balanceSubtext}
          />
        </div>
      </div>

      {/* Cash Flow Chart and My Accounts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-12 gap-4 sm:gap-6 xl:gap-3 items-stretch">
        {/* Cash Flow Chart - 8 columns */}
        <div className="lg:col-span-1 xl:col-span-8 flex">
          <CashFlowChart data={cashFlowData} />
        </div>

        {/* My Accounts - 4 columns */}
        <div className="lg:col-span-1 xl:col-span-4 flex">
          <MyAccountsSection
            accounts={stats.cards}
            onAddAccount={handleAddAccount}
            onAction={handleCardAction}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)] xl:grid-cols-[300px_minmax(0,1fr)] gap-4 sm:gap-6 xl:gap-4 items-stretch">
        <div className="lg:col-span-1 flex">
          <CategorySummary categories={stats.categoryExpenses} />
        </div>

        <div className="lg:col-span-1 flex min-w-0">
          <RecentTransactionsTable
            transactions={stats.recentTransactions}
            onFilter={handleFilter}
          />
        </div>
      </div>


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
