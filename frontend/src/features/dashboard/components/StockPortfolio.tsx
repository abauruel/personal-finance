import { TrendingUp } from 'lucide-react';

interface StockPortfolioProps {
  currentValue: number;
  previousValue: number;
  change: number;
}

export function StockPortfolio({ currentValue, previousValue, change }: StockPortfolioProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  // Mock data points for the line chart
  const dataPoints = [
    { x: 0, y: 4462 },
    { x: 1, y: 4234 },
    { x: 2, y: 4400 },
    { x: 3, y: 4100 },
    { x: 4, y: 4300 },
    { x: 5, y: 4000 },
    { x: 6, y: 4200 },
    { x: 7, y: 4240 },
  ];

  const timeLabels = ['30 AM', '1 PM', '4 PM', '7 PM', '10 PM', '1 AM', '4 AM', '7 AM', '10 AM'];

  const maxY = Math.max(...dataPoints.map(p => p.y));
  const minY = Math.min(...dataPoints.map(p => p.y));
  const range = maxY - minY;

  // Calculate SVG path for the line
  const width = 100;
  const height = 100;
  const padding = 5;

  const points = dataPoints.map((point, index) => {
    const x = (index / (dataPoints.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((point.y - minY) / range) * (height - 2 * padding) - padding;
    return { x, y };
  });

  const pathData = points.map((point, index) =>
    `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`
  ).join(' ');

  // Create gradient path
  const gradientPathData = `${pathData} L ${width - padding} ${height} L ${padding} ${height} Z`;

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Stock portfolio</h3>
        <p className="text-sm text-gray-500">{formatCurrency(previousValue)}</p>
      </div>

      {/* Current Value and Change */}
      <div className="flex items-end justify-between mb-5">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatCurrency(currentValue)}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600 font-medium">
              +${change.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Current Time Indicator */}
        <div className="text-right">
          <p className="text-xs text-gray-500">10 PM</p>
          <div className="w-2 h-2 bg-purple-600 rounded-full mt-1 ml-auto"></div>
        </div>
      </div>

      {/* Line Chart */}
      <div className="relative h-32">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          {/* Gradient Definition */}
          <defs>
            <linearGradient id="portfolioGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.05" />
            </linearGradient>
          </defs>

          {/* Gradient Area */}
          <path
            d={gradientPathData}
            fill="url(#portfolioGradient)"
          />

          {/* Line */}
          <path
            d={pathData}
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Current Point Indicator */}
          <circle
            cx={points[points.length - 1].x}
            cy={points[points.length - 1].y}
            r="3"
            fill="#8b5cf6"
          />
        </svg>

        {/* Time Labels */}
        <div className="flex justify-between mt-2">
          {timeLabels.filter((_, i) => i % 2 === 0).map((label, index) => (
            <span key={index} className="text-xs text-gray-400">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
