import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CreditCard, PiggyBank, Wallet } from 'lucide-react';
import { toast } from 'sonner';

import { Card } from '../../../components/ui';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { accountsApi } from '../api/accountsApi';
import { AccountForm } from '../components/AccountForm';
import type { Account } from '../../../types/models.types';

const accountTypeIcons = {
  CHECKING: Wallet,
  SAVINGS: PiggyBank,
  CREDIT_CARD: CreditCard,
};

const accountTypeLabels = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Conta Poupança',
  CREDIT_CARD: 'Cartão de Crédito',
};

const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAccounts();
  }, []);

  const loadAccounts = async () => {
    try {
      setIsLoading(true);
      const data = await accountsApi.getAll();
      setAccounts(data);
    } catch (error: any) {
      toast.error('Erro ao carregar contas');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (account?: Account) => {
    setSelectedAccount(account);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAccount(undefined);
  };

  const handleSubmit = async (data: any) => {
    try {
      setIsSubmitting(true);
      if (selectedAccount) {
        await accountsApi.update(selectedAccount.id, data);
        toast.success('Conta atualizada com sucesso!');
      } else {
        await accountsApi.create(data);
        toast.success('Conta criada com sucesso!');
      }
      await loadAccounts();
      handleCloseModal();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao salvar conta';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta conta?')) return;

    try {
      await accountsApi.delete(id);
      toast.success('Conta excluída com sucesso!');
      await loadAccounts();
    } catch (error: any) {
      const message = error.response?.data?.message || 'Erro ao excluir conta';
      toast.error(message);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Contas</h1>
        <Button
          variant="primary"
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2"
        >
          <Plus size={20} />
          Nova Conta
        </Button>
      </div>

      {isLoading ? (
        <Card>
          <p className="text-gray-600 text-center py-8">Carregando...</p>
        </Card>
      ) : accounts.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <Wallet size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 mb-4">Nenhuma conta cadastrada</p>
            <Button variant="primary" onClick={() => handleOpenModal()}>
              Criar primeira conta
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account) => {
            const Icon = accountTypeIcons[account.type];
            return (
              <Card key={account.id} className="hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Icon size={24} className="text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{account.name}</h3>
                      <p className="text-sm text-gray-600">
                        {accountTypeLabels[account.type]}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleOpenModal(account)}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(account.id)}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Saldo Atual</span>
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(account.currentBalance)}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedAccount ? 'Editar Conta' : 'Nova Conta'}
      >
        <AccountForm
          account={selectedAccount}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={isSubmitting}
        />
      </Modal>
    </div>
  );
};

export default AccountsPage;
