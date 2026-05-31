import { StatCard } from './StatCard';

interface SummaryCardsProps {
  income: number;
  expense: number;
  incomeChange?: { value: number; isPositive: boolean };
  expenseChange?: { value: number; isPositive: boolean };
  incomeSubtext?: string;
  expenseSubtext?: string;
}

export function SummaryCards({
  income,
  expense,
  incomeChange,
  expenseChange,
  incomeSubtext,
  expenseSubtext,
}: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <StatCard
        title="Income"
        value={income}
        type="income"
        trend={incomeChange}
        subtext={incomeSubtext}
      />
      <StatCard
        title="Expense"
        value={expense}
        type="expense"
        trend={expenseChange}
        subtext={expenseSubtext}
      />
    </div>
  );
}
