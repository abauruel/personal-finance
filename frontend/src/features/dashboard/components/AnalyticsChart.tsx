import { useState } from 'react';

type TimeFrame = 'week' | 'month' | '6months' | 'year';

interface AnalyticsChartProps {
  expectedIncome: number;
}

export function AnalyticsChart({ expectedIncome }: AnalyticsChartProps) {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('6months');

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(val);
  };

  const timeFrames: { value: TimeFrame; label: string }[] = [
    { value: 'week', label: 'Week' },
    { value: 'month', label: 'Month' },
    { value: '6months', label: '6 months' },
    { value: 'year', label: 'Year' },
  ];

  // Mock data for the chart
  const chartData = [
    { month: 'Jan', value: 40 },
    { month: 'Feb', value: 45 },
    { month: 'Mar', value: 35 },
    { month: 'Apr', value: 55 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 30 },
  ];

  const maxValue = Math.max(...chartData.map(d => d.value));

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics</h3>
        <p className="text-sm text-gray-500 mb-1">Expected income</p>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {formatCurrency(expectedIncome)}
        </p>
      </div>

      {/* Time Frame Selector */}
      <div className="flex gap-2 mb-5">
        {timeFrames.map((tf) => (
          <button
            key={tf.value}
            onClick={() => setTimeFrame(tf.value)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap ${timeFrame === tf.value
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            {tf.label}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div className="h-40 relative">
        <div className="flex items-end justify-between h-full gap-3">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
              <div
                className="w-full bg-linear-to-t from-purple-500 to-purple-300 rounded-t-lg transition-all hover:opacity-80"
                style={{
                  height: `${(data.value / maxValue) * 100}%`,
                  minHeight: '10%',
                }}
              />
              <span className="text-xs text-gray-500 mt-1.5">{data.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
