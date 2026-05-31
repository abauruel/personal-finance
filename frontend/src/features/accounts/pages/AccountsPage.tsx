import { useState } from 'react';
import { Plus, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { AccountModal } from '../components/AccountModal';
import { AccountList } from '../components/AccountList';
import { useAccounts } from '../hooks/useAccounts';
import type { Account } from '../../../types/models.types';

const AccountsPage = () => {
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
        toast.success('Conta atualizada com sucesso!');
      } else {
        await createAccount(data);
        toast.success('Conta criada com sucesso!');
      }
      handleCloseModal();
    } catch (error) {
      toast.error(
        editingAccount
          ? 'Erro ao atualizar conta'
          : 'Erro ao criar conta'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (
      !confirm(
        'Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.'
      )
    ) {
      return;
    }

    try {
      await deleteAccount(id);
      toast.success('Conta excluída com sucesso!');
    } catch (error) {
      toast.error('Erro ao excluir conta');
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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Minhas Contas</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie suas contas bancárias e cartões
          </p>
        </div>
        <Button
          onClick={handleOpenModal}
          className="flex items-center gap-2"
          disabled={isDeleting}
        >
          <Plus size={20} />
          Nova Conta
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
                {Math.abs(balanceChangePercent).toFixed(1)}%
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-gray-600">Saldo Total</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(totalBalance)}
              </p>
              <p className="text-xs text-gray-500">
                {balanceChange >= 0 ? '+' : ''}
                {formatCurrency(balanceChange)} desde o início
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
              <p className="text-sm text-gray-600">Total de Contas</p>
              <p className="text-2xl font-bold text-gray-900">{accounts.length}</p>
              <p className="text-xs text-gray-500">Contas ativas</p>
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
              <p className="text-sm text-gray-600">Saldo Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(
                  accounts.length > 0 ? totalBalance / accounts.length : 0
                )}
              </p>
              <p className="text-xs text-gray-500">Por conta</p>
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
