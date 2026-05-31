import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionTable } from '../components/TransactionTable';
import { transactionsApi } from '../api/transactionsApi';
import type { Transaction } from '../../../types/models.types';

interface TransactionFiltersType {
  search?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  status?: string;
  paymentType?: string;
}

const TransactionsPage = () => {
  const queryClient = useQueryClient();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TransactionFiltersType>({});

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.getAll(filters),
  });

  const createMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Transação criada com sucesso!');
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error('Erro ao criar transação');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Transação atualizada com sucesso!');
      setIsModalOpen(false);
      setEditingTransaction(null);
    },
    onError: () => {
      toast.error('Erro ao atualizar transação');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success('Transação excluída com sucesso!');
    },
    onError: () => {
      toast.error('Erro ao excluir transação');
    },
  });

  const handleSubmit = (data: any) => {
    if (editingTransaction) {
      updateMutation.mutate({ id: editingTransaction.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Deseja realmente excluir esta transação?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTransaction(null);
  };

  const clearFilters = () => {
    setFilters({});
  };

  const activeFiltersCount = Object.values(filters).filter(
    (v) => v !== undefined && v !== ''
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transações</h1>
          <p className="text-sm text-gray-500 mt-1">
            Gerencie todas as suas transações financeiras
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center gap-2"
          >
            <Filter size={20} />
            Filtros
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <TransactionFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClear={clearFilters}
        />
      )}

      {/* Stats Summary */}
      {transactions.length > 0 && (
        <div className="grid grid-cols-3 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Total de Transações</div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Receitas</div>
            <div className="text-2xl font-bold text-green-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(
                transactions
                  .filter((t) => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">Despesas</div>
            <div className="text-2xl font-bold text-red-600">
              {new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL',
              }).format(
                Math.abs(
                  transactions
                    .filter((t) => t.amount < 0)
                    .reduce((sum, t) => sum + t.amount, 0)
                )
              )}
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <TransactionTable
        transactions={transactions}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        <TransactionForm
          transaction={editingTransaction || undefined}
          onSubmit={handleSubmit}
          onCancel={handleCloseModal}
          isLoading={createMutation.isPending || updateMutation.isPending}
        />
      </Modal>
    </div>
  );
};

export default TransactionsPage;
