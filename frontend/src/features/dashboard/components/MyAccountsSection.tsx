import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { QuickActionButtons, type ActionType } from './QuickActionButtons';
import type { AccountCard } from '../api/dashboardApi';
import { useFormatters } from '../../../hooks/useFormatters';
import { useSettings } from '../../../contexts/SettingsContext';
import { getDashboardAccountTypeLabel, getDashboardMessages } from '../lib/dashboardLocale';

interface MyAccountsSectionProps {
  accounts: AccountCard[];
  onAddAccount?: () => void;
  onAction?: (action: ActionType) => void;
}

export function MyAccountsSection({ accounts, onAddAccount, onAction }: MyAccountsSectionProps) {
  const { settings } = useSettings();
  const { formatCurrency } = useFormatters();
  const messages = getDashboardMessages(settings.locale);

  const getAccountTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'CHECKING':
        return 'from-blue-500 to-blue-600';
      case 'SAVINGS':
        return 'from-green-500 to-green-600';
      case 'INVESTMENT':
        return 'from-purple-500 to-purple-600';
      case 'CREDIT':
        return 'from-orange-500 to-orange-600';
      default:
        return 'from-primary to-primary-dark';
    }
  };

  const getAccountTypeLabel = (type: string) => {
    return getDashboardAccountTypeLabel(type, settings.locale);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-card h-full w-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{messages.myAccounts}</h3>
        <button
          onClick={onAddAccount}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:text-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4" />
          {messages.add}
        </button>
      </div>

      {/* Empty State */}
      {accounts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-12">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <Wallet className="w-10 h-10 text-gray-400" />
          </div>
          <h4 className="text-lg font-semibold text-gray-900 mb-2">{messages.noAccountsTitle}</h4>
          <p className="text-sm text-gray-500 text-center max-w-xs mb-6">
            {messages.noAccountsDescription}
          </p>
          <button
            onClick={onAddAccount}
            className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            {messages.addAccount}
          </button>
        </div>
      ) : (
        <>
          {/* Accounts */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            {accounts.map((account) => (
              <div
                key={account.id}
                className={`relative h-40 rounded-2xl bg-gradient-to-br ${getAccountTypeColor(account.type)} p-6 text-white overflow-hidden cursor-pointer hover:scale-105 transition-transform`}
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
                      <p className="text-xs opacity-80 mb-1">{getAccountTypeLabel(account.type)}</p>
                      <p className="text-lg font-semibold">{account.name}</p>
                    </div>
                    <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
                      <Wallet className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Balance */}
                  <div>
                    <p className="text-xs opacity-80 mb-1">{messages.availableBalance}</p>
                    <p className="text-2xl font-bold tracking-tight">{formatCurrency(account.balance)}</p>
                  </div>
                </div>

                {/* Balance Indicator Icon */}
                <div className="absolute bottom-6 right-6 opacity-40">
                  {account.balance >= 0 ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <TrendingDown className="w-6 h-6" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Action Buttons */}
          <div className="mt-6">
            <QuickActionButtons onAction={onAction} />
          </div>
        </>
      )}
    </div>
  );
}
