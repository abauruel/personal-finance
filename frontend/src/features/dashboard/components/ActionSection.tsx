import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';

interface ActionSectionProps {
  monthlyExpenses: number;
  favoriteCategories?: Array<{ name: string; color: string }>;
}

export function ActionSection({ monthlyExpenses, favoriteCategories = [] }: ActionSectionProps) {
  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(val);
  };

  const defaultCategories = [
    { name: 'Food', color: '#3b82f6' },
    { name: 'Transport', color: '#8b5cf6' },
    { name: 'Shopping', color: '#ec4899' },
  ];

  const categories = favoriteCategories.length > 0 ? favoriteCategories : defaultCategories;

  return (
    <div className="space-y-4">
      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        {/* Transfer Button */}
        <button className="bg-white rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center shrink-0">
            <ArrowUpRight className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Transfer</p>
          </div>
        </button>

        {/* Receive Button */}
        <button className="bg-white rounded-xl p-4 flex items-start gap-3 hover:shadow-md transition-shadow">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center shrink-0">
            <ArrowDownLeft className="w-5 h-5 text-green-600" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-gray-900">Receive</p>
          </div>
        </button>
      </div>

      {/* Expenses in May Card */}
      <div className="bg-white rounded-xl p-5">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-gray-600 mb-0.5">Expenses in May</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(monthlyExpenses)}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden flex">
              {categories.map((category, index) => (
                <div
                  key={index}
                  className="h-full"
                  style={{
                    backgroundColor: category.color,
                    width: `${100 / categories.length}%`,
                  }}
                />
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-4">
              {categories.map((category, index) => (
                <div key={index} className="flex items-center gap-1.5">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-gray-600">{category.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Favorite Spends Card */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-5">
        <p className="text-sm font-medium text-gray-700 mb-3">Favorite spends</p>
        <div className="flex items-center gap-3">
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={index}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              style={{ backgroundColor: category.color }}
            >
              {category.name.charAt(0)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
