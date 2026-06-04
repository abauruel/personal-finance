import { useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { AccountModal } from '../components/AccountModal';
import { AccountList } from '../components/AccountList';
import { useAccounts } from '../hooks/useAccounts';
import { useFormatters } from '../../../hooks/useFormatters';
import type { Account } from '../../../types/models.types';
import { useSettings } from '../../../contexts/SettingsContext';
import { getAccountMessages } from '../../../lib/featureLocale';

const AccountsPage = () => {
  const { settings } = useSettings();
  const { formatCurrency, formatPercent } = useFormatters();
  const messages = getAccountMessages(settings.locale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);

  const {
    accounts,
    isLoading,
    createAccount,
    isCreating,
    updateAccount,
    isUpdating,
    deleteAccount,
    isDeleting,
  } = useAccounts();

  const handleOpenModal = () => {
    setEditingAccount(null);
    setIsModalOpen(true);
  };

  const handleEdit = (account: Account) => {
    setEditingAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAccount(null);
  };

  const handleSubmit = async (data: any) => {
    try {
      if (editingAccount) {
        await updateAccount({ id: editingAccount.id, data });
        toast.success(messages.updateSuccess);
      } else {
        await createAccount(data);
        toast.success(messages.createSuccess);
      }
      handleCloseModal();
    } catch (error) {
      toast.error(
        editingAccount
          ? messages.updateError
          : messages.createError
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(messages.confirmDelete)
    ) {
      return;
    }

    try {
      await deleteAccount(id);
      toast.success(messages.deleteSuccess);
    } catch (error) {
      toast.error(messages.deleteError);
    }
  };

  // Calculate statistics
  const totalBalance = accounts.reduce(
    (sum, account) => sum + account.currentBalance,
    0
  );
  const totalInitial = accounts.reduce(
    (sum, account) => sum + account.initialBalance,
    0
  );
  const balanceChange = totalBalance - totalInitial;
  const balanceChangePercent =
    totalInitial !== 0 ? (balanceChange / totalInitial) * 100 : 0;


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{messages.pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {messages.pageSubtitle}
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          className="flex items-center gap-2"
          disabled={isDeleting}
        >
          <Plus size={20} />
          {messages.newAccount}
        </Button>
      </div>

      {/* Statistics Cards */}
      {accounts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Balance */}
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-blue-600" />
              </div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${balanceChange >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}
              >
                {balanceChange >= 0 ? (
                  <TrendingUp size={16} />
                ) : (
                  <TrendingDown size={16} />
                )}
                {formatPercent(Math.abs(balanceChangePercent), { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">{messages.totalBalance}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBalance)}
              </p>
              <p className="text-xs text-gray-500">
                {balanceChange >= 0 ? '+' : ''}
                {messages.balanceChangeFromStart(formatCurrency(balanceChange))}
              </p>
            </div>
          </div>

          {/* Number of Accounts */}
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">{messages.totalAccounts}</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              <p className="text-xs text-gray-500">{messages.activeAccounts}</p>
            </div>
          </div>

          {/* Average Balance */}
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">{messages.averageBalance}</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  accounts.length > 0 ? totalBalance / accounts.length : 0
                )}
              </p>
              <p className="text-xs text-gray-500">{messages.perAccount}</p>
            </div>
          </div>
        </div>
      )}

      {/* Accounts List */}
      <AccountList
        accounts={accounts}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Modal */}
      <AccountModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        account={editingAccount || undefined}
        isLoading={isCreating || isUpdating}
      />
    </div>
  );
};

export default AccountsPage;
