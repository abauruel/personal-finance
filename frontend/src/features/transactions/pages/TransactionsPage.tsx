import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit2, Trash2, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TransactionForm } from '../components/TransactionForm';
import { transactionsApi } from '../api/transactionsApi';
import type { Transaction } from '../../../types/models.types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface TransactionFilters {
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
  const [filters, setFilters] = useState<TransactionFilters>({});

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

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PAID: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    const labels = {
      PENDING: 'Pendente',
      PAID: 'Pago',
      CANCELLED: 'Cancelado',
    };
    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status as keyof typeof styles]}`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const getPaymentTypeLabel = (type: string) => {
    const labels = {
      DEBIT: 'Débito',
      CREDIT: 'Crédito',
      PIX: 'PIX',
      CASH: 'Dinheiro',
      TRANSFER: 'Transferência',
    };
    return labels[type as keyof typeof labels] || type;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Transações</h1>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filtros
          </Button>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Nova Transação
          </Button>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white p-4 rounded-lg shadow-sm space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Início
              </label>
              <input
                type="date"
                value={filters.startDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, startDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Data Fim
              </label>
              <input
                type="date"
                value={filters.endDate || ''}
                onChange={(e) =>
                  setFilters({ ...filters, endDate: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status || ''}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-lg"
              >
                <option value="">Todos</option>
                <option value="PENDING">Pendente</option>
                <option value="PAID">Pago</option>
                <option value="CANCELLED">Cancelado</option>
              </select>
            </div>
          </div>
          <Button variant="secondary" onClick={clearFilters}>
            Limpar Filtros
          </Button>
        </div>
      )}

      {/* Lista de Transações */}
      {isLoading ? (
        <div className="text-center py-12">Carregando...</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <p className="text-gray-500 mb-4">Nenhuma transação encontrada</p>
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus size={20} />
            Criar primeira transação
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Data
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Descrição
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Categoria
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Conta
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Valor
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {format(new Date(transaction.date), 'dd/MM/yyyy', {
                        locale: ptBR,
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="font-medium text-gray-900">
                        {transaction.description}
                      </div>
                      {transaction.notes && (
                        <div className="text-gray-500 text-xs mt-1">
                          {transaction.notes}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.category && (
                        <div className="flex items-center gap-2">
                          <span>{transaction.category.icon}</span>
                          <span>{transaction.category.name}</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {transaction.account?.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getPaymentTypeLabel(transaction.paymentType)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right font-medium ${
                        transaction.amount >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      {getStatusBadge(transaction.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleEdit(transaction)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(transaction.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
