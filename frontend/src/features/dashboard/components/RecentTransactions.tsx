import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface RecentTransactionsProps {
  transactions: Array<{
    id: string;
    date: Date;
    description: string;
    amount: number;
    category: {
      name: string;
      icon: string;
    };
    account: {
      name: string;
    };
  }>;
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const [selectedPeriod] = useState('Today');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(Math.abs(value));
  };

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-lg font-semibold mb-4">Transactions</h2>
        <div className="text-center py-8 text-gray-500">
          No transactions recorded
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6">
      {/* Header with Filters */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Transactions</h2>

        <div className="flex gap-3">
          {/* Period Dropdown */}
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <span>Period</span>
            <ChevronDown className="w-4 h-4" />
          </button>

          {/* Account Dropdown */}
          <button className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg text-sm text-gray-700 hover:bg-gray-100 transition-colors">
            <span>Card or account</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Transactions List */}
      <div className="space-y-1">
        {/* Today Section */}
        <div className="text-xs font-medium text-gray-500 mb-3 mt-1">{selectedPeriod}</div>

        {transactions.slice(0, 3).map((transaction) => (
          <div
            key={transaction.id}
            className="flex items-center justify-between py-3 px-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm">
                {transaction.category.icon}
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">
                  {transaction.description}
                </p>
                <p className="text-xs text-gray-500">
                  {transaction.category.name}
                </p>
              </div>
            </div>
            <p className={`font-semibold text-sm ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'
              }`}>
              {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
            </p>
          </div>
        ))}

        {/* Previous Date Section */}
        {transactions.length > 3 && (
          <>
            <div className="text-xs font-medium text-gray-500 mt-4 mb-2">
              September 14, Sat
            </div>

            {transactions.slice(3, 5).map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between py-2.5 px-2 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm">
                    {transaction.category.icon}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {transaction.category.name}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold text-sm ${transaction.amount >= 0 ? 'text-green-600' : 'text-gray-900'
                  }`}>
                  {transaction.amount >= 0 ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
