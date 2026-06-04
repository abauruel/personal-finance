import { ArrowDown, ArrowUp, MoreVertical } from 'lucide-react';
import { useFormatters } from '../../../hooks/useFormatters';

interface StatCardProps {
  title: string;
  value: number;
  type: 'income' | 'expense';
  trend?: {
    value: number;
    isPositive: boolean;
  };
  subtext?: string;
  onMenuClick?: () => void;
}

export function StatCard({ title, value, type, trend, subtext, onMenuClick }: StatCardProps) {
  const { formatCurrency, formatPercent } = useFormatters();

  const getCardStyle = () => {
    if (type === 'income') {
      return {
        bg: 'bg-white',
        icon: <ArrowDown className="w-5 h-5 text-green-600" />,
        iconBg: 'bg-green-50',
        trendColor: trend?.isPositive ? 'text-green-600' : 'text-red-600',
      };
    }
    return {
      bg: 'bg-white',
      icon: <ArrowUp className="w-5 h-5 text-red-600" />,
      iconBg: 'bg-red-50',
      trendColor: trend?.isPositive ? 'text-red-600' : 'text-green-600',
    };
  };

  const cardStyle = getCardStyle();

  return (
    <div className={`${cardStyle.bg} rounded-2xl p-6 shadow-card hover:shadow-card-hover transition-all`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className={`${cardStyle.iconBg} p-2 rounded-lg`}>
          {cardStyle.icon}
        </div>
        <button
          onClick={onMenuClick}
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="More options"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Title */}
      <h3 className="text-sm font-medium text-gray-600 mb-3">{title}</h3>

      {/* Value */}
      <p className="text-3xl font-bold text-gray-900 mb-2">{formatCurrency(Math.abs(value))}</p>

      {/* Trend */}
      {trend && (
        <div className="flex items-center gap-1 mb-2">
          {trend.isPositive ? (
            <ArrowUp className="w-4 h-4 text-green-600" />
          ) : (
            <ArrowDown className="w-4 h-4 text-red-600" />
          )}
          <span className={`text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {formatPercent(trend.value, { minimumFractionDigits: 0, maximumFractionDigits: 1 })}
          </span>
        </div>
      )}

      {/* Subtext */}
      {subtext && <p className="text-sm text-gray-500 mt-2">{subtext}</p>}
    </div>
  );
}
