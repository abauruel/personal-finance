import { ArrowUp, ArrowDown } from 'lucide-react';
import { LineChart, Line, ResponsiveContainer } from 'recharts';
import type { BalanceHistoryPoint } from '../api/dashboardApi';
import { useFormatters } from '../../../hooks/useFormatters';
import { useSettings } from '../../../contexts/SettingsContext';
import { getDashboardMessages } from '../lib/dashboardLocale';

interface BalanceCardProps {
  balance: number;
  change?: { value: number; isPositive: boolean };
  chartData?: BalanceHistoryPoint[];
  subtext?: string;
}

export function BalanceCard({ balance, change, chartData, subtext }: BalanceCardProps) {
  const { settings } = useSettings();
  const { formatCurrency, formatPercent } = useFormatters();
  const messages = getDashboardMessages(settings.locale);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card">
      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 mb-4">{messages.myBalance}</h3>

      {/* Balance Value */}
      <div className="mb-4">
        <p className="text-4xl font-bold text-gray-900 mb-2">{formatCurrency(balance)}</p>
        {change && (
          <div className="flex items-center gap-2">
            {change.isPositive ? (
              <ArrowUp className="w-5 h-5 text-green-600" />
            ) : (
              <ArrowDown className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-semibold ${change.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {formatPercent(change.value, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
            </span>
          </div>
        )}
      </div>

      {/* Subtext */}
      {subtext && <p className="text-sm text-gray-500 mb-4">{subtext}</p>}

      {/* Mini Line Chart */}
      <div className="mt-6 h-24 -mx-2">
        {chartData && chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#6366f1"
                strokeWidth={2}
                dot={false}
                animationDuration={300}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-xs text-gray-400">{messages.noChartData}</p>
          </div>
        )}
      </div>
    </div>
  );
}
