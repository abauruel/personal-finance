import { Edit2, Trash2, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import type { Account } from '../../../types/models.types';
import { useFormatters } from '../../../hooks/useFormatters';
import { useSettings } from '../../../contexts/SettingsContext';
import { getAccountMessages, getAccountTypeLabel } from '../../../lib/featureLocale';

interface AccountListProps {
  accounts: Account[];
  onEdit: (account: Account) => void;
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

export function AccountList({
  accounts,
  onEdit,
  onDelete,
  isLoading,
}: AccountListProps) {
  const { settings } = useSettings();
  const { formatCurrency } = useFormatters();
  const messages = getAccountMessages(settings.locale);

  const getAccountTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CHECKING':
        return 'from-blue-500 to-blue-600';
      case 'SAVINGS':
        return 'from-green-500 to-green-600';
      case 'CREDIT_CARD':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-primary to-primary-dark';
    }
  };

  const getAccountTypeIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CHECKING':
        return '💳';
      case 'SAVINGS':
        return '🏦';
      case 'CREDIT_CARD':
        return '💳';
      default:
        return '💰';
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-56 bg-gray-100 rounded-2xl animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  if (accounts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-card border border-gray-100 p-12 text-center">
        <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Wallet className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {messages.list.emptyTitle}
        </h3>
        <p className="text-gray-500 text-sm">
          {messages.list.emptyHint}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {accounts.map((account) => (
        <div
          key={account.id}
          className={`relative h-56 rounded-2xl bg-gradient-to-br ${getAccountTypeColor(account.type)} p-6 text-white overflow-hidden shadow-lg hover:shadow-xl transition-all group`}
        >
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-5 right-5 w-32 h-32 rounded-full bg-white"></div>
            <div className="absolute bottom-5 left-5 w-24 h-24 rounded-full bg-white"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-between">
            {/* Top Section */}
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-2xl">{getAccountTypeIcon(account.type)}</span>
                  <p className="text-xs opacity-80">
                    {getAccountTypeLabel(account.type, settings.locale)}
                  </p>
                </div>
                <h3 className="text-xl font-bold">{account.name}</h3>
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => onEdit(account)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                  title={messages.list.edit}
                >
                  <Edit2 size={16} />
                </button>
                <button
                  onClick={() => onDelete(account.id)}
                  className="p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                  title={messages.list.delete}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            {/* Middle Section - Balance */}
            <div>
              <p className="text-xs opacity-80 mb-1">{messages.list.currentBalance}</p>
              <p className="text-3xl font-bold tracking-tight">
                {formatCurrency(account.currentBalance)}
              </p>
            </div>

            {/* Bottom Section - Initial Balance & Indicator */}
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs opacity-80">{messages.list.initialBalance}</p>
                <p className="text-sm font-semibold">
                  {formatCurrency(account.initialBalance)}
                </p>
              </div>

              {/* Balance Change Indicator */}
              <div className="opacity-40">
                {account.currentBalance >= account.initialBalance ? (
                  <TrendingUp className="w-6 h-6" />
                ) : (
                  <TrendingDown className="w-6 h-6" />
                )}
              </div>
            </div>
          </div>

          {/* Decorative Element */}
          <div className="absolute bottom-0 right-0 w-32 h-32 opacity-10">
            <Wallet className="w-full h-full" />
          </div>
        </div>
      ))}
    </div>
  );
}
