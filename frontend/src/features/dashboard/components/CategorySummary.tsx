import { useSettings } from '../../../contexts/SettingsContext';
import { useFormatters } from '../../../hooks/useFormatters';
import { getDashboardMessages } from '../lib/dashboardLocale';

interface CategorySummaryProps {
  categories: Array<{
    categoryId: string;
    categoryName: string;
    icon: string;
    color: string;
    total: number;
  }>;
}

export function CategorySummary({ categories }: CategorySummaryProps) {
  const { settings } = useSettings();
  const { formatCurrency } = useFormatters();
  const messages = getDashboardMessages(settings.locale);

  if (categories.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {messages.categorySummaryTitle}
        </h3>
        <div className="text-sm text-gray-500">{messages.categorySummaryEmpty}</div>
      </div>
    );
  }

  const totalExpenses = categories.reduce((sum, category) => sum + category.total, 0);
  const topCategories = categories.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-5">
        {messages.categorySummaryTitle}
      </h3>

      <div className="space-y-4">
        {topCategories.map((category) => {
          const percentage = totalExpenses > 0 ? (category.total / totalExpenses) * 100 : 0;

          return (
            <div key={category.categoryId} className="space-y-2">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="truncate font-medium text-gray-900">
                      {category.categoryName}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {percentage.toFixed(1)}% {messages.categorySummaryOfTotal}
                  </p>
                </div>
                <div className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                  {formatCurrency(category.total)}
                </div>
              </div>

              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min(percentage, 100)}%`,
                    backgroundColor: category.color,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
