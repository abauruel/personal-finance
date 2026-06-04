import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Filter, Upload } from 'lucide-react';
import { toast } from 'sonner';
import type { AxiosError } from 'axios';
import { Button } from '../../../components/ui/Button';
import { Modal } from '../../../components/ui/Modal';
import { TransactionForm } from '../components/TransactionForm';
import { TransactionFilters } from '../components/TransactionFilters';
import { TransactionTable } from '../components/TransactionTable';
import { CsvImportModal } from '../components/CsvImportModal';
import { transactionsApi } from '../api/transactionsApi';
import { accountsApi } from '../../accounts/api/accountsApi';
import { categoriesApi } from '../../categories/api/categoriesApi';
import type { Transaction } from '../../../types/models.types';
import { useSettings } from '../../../contexts/SettingsContext';
import { useFormatters } from '../../../hooks/useFormatters';
import { getTransactionMessages } from '../../../lib/featureLocale';

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
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { settings } = useSettings();
  const { formatCurrency } = useFormatters();
  const messages = getTransactionMessages(settings.locale);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<TransactionFiltersType>({
    search: searchParams.get('search') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    categoryId: searchParams.get('categoryId') || undefined,
    accountId: searchParams.get('accountId') || undefined,
    status: searchParams.get('status') || undefined,
    paymentType: searchParams.get('paymentType') || undefined,
  });

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionsApi.getAll(filters),
  });

  const { data: accounts = [] } = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: categoriesApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: transactionsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success(messages.createSuccess);
      setIsModalOpen(false);
    },
    onError: () => {
      toast.error(messages.createError);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      transactionsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success(messages.updateSuccess);
      setIsModalOpen(false);
      setEditingTransaction(null);
    },
    onError: () => {
      toast.error(messages.updateError);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: transactionsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      toast.success(messages.deleteSuccess);
    },
    onError: () => {
      toast.error(messages.deleteError);
    },
  });

  const importMutation = useMutation({
    mutationFn: async (items: Parameters<typeof transactionsApi.create>[0][]) => {
      for (const item of items) {
        await transactionsApi.create(item);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      toast.success(messages.importSuccess);
      setIsImportModalOpen(false);
    },
    onError: (error: unknown) => {
      const axiosError = error as AxiosError<{ message?: string | string[] }>;
      const message = axiosError.response?.data?.message;
      const errorMessage = Array.isArray(message) ? message.join(', ') : message;
      toast.error(errorMessage || messages.importError);
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
    if (confirm(messages.confirmDelete)) {
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
          <h1 className="text-2xl font-bold text-gray-900">{messages.pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            {messages.pageSubtitle}
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-2"
          >
            <Upload size={20} />
            {messages.importFile}
          </Button>
          <Button
            variant="secondary"
            onClick={() => setShowFilters(!showFilters)}
            className="relative flex items-center gap-2"
          >
            <Filter size={20} />
            {messages.filters}
            {activeFiltersCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </Button>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={20} />
            {messages.newTransaction}
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
            <div className="text-sm text-gray-600 mb-1">{messages.totalTransactions}</div>
            <div className="text-2xl font-bold text-gray-900">{transactions.length}</div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">{messages.income}</div>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(
                transactions
                  .filter((t) => t.amount > 0)
                  .reduce((sum, t) => sum + t.amount, 0)
              )}
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-card border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">{messages.expenses}</div>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(
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

      <CsvImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        accounts={accounts}
        categories={categories}
        existingTransactions={transactions}
        onImport={async (items) => {
          await importMutation.mutateAsync(items);
        }}
        isImporting={importMutation.isPending}
      />
    </div>
  );
};

export default TransactionsPage;
