import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import type { CashFlowData } from '../api/dashboardApi';
import { useFormatters } from '../../../hooks/useFormatters';
import { useSettings } from '../../../contexts/SettingsContext';
import { getDashboardMessages } from '../lib/dashboardLocale';

interface CashFlowChartProps {
  data: CashFlowData[];
  period?: string;
  onPeriodChange?: (period: string) => void;
}

export function CashFlowChart({ data, period = 'This Year', onPeriodChange }: CashFlowChartProps) {
  const [showPeriodMenu, setShowPeriodMenu] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const { settings } = useSettings();
  const { formatCurrency, formatNumber } = useFormatters();
  const messages = getDashboardMessages(settings.locale);

  const periodOptions = [messages.periods.thisYear, messages.periods.lastYear, messages.periods.custom];
  const currentPeriod = period === 'This Year' ? messages.periods.thisYear : period === 'Last Year' ? messages.periods.lastYear : period === 'Custom' ? messages.periods.custom : period;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
          <p className="font-semibold text-gray-900 mb-2">{label}</p>
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="text-sm text-gray-600">{messages.cashIn}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(payload[0].value)}</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary-light"></div>
                <span className="text-sm text-gray-600">{messages.cashOut}</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">{formatCurrency(payload[1].value)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-card w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{messages.cashFlowTitle}</h3>
        <div className="relative">
          <button
            onClick={() => setShowPeriodMenu(!showPeriodMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-700 transition-colors"
          >
            {currentPeriod}
            <ChevronDown className="w-4 h-4" />
          </button>
          {showPeriodMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10">
              {periodOptions.map((periodOption, index) => (
                <button
                  key={periodOption}
                  onClick={() => {
                    onPeriodChange?.(index === 0 ? 'This Year' : index === 1 ? 'Last Year' : 'Custom');
                    setShowPeriodMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors"
                >
                  {periodOption}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Chart */}
      <div className="h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            barGap={8}
            barCategoryGap="20%"
            onMouseMove={(state) => {
              if (state && state.activeLabel) {
                setSelectedMonth(String(state.activeLabel));
              }
            }}
            onMouseLeave={() => setSelectedMonth(null)}
          >
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#9ca3af', fontSize: 12 }}
              tickFormatter={(value) => formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(99, 102, 241, 0.05)' }} />
            <Legend
              iconType="circle"
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
            <Bar dataKey="cashIn" name={messages.cashIn} fill="#6366f1" radius={[8, 8, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-in-${index}`}
                  fill={selectedMonth === entry.month ? '#4f46e5' : '#6366f1'}
                />
              ))}
            </Bar>
            <Bar dataKey="cashOut" name={messages.cashOut} fill="#818cf8" radius={[8, 8, 0, 0]} barSize={40}>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-out-${index}`}
                  fill={selectedMonth === entry.month ? '#6366f1' : '#818cf8'}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
