import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { accountsApi } from '../api/accountsApi';

interface CreateAccountData {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  initialBalance?: number;
  color?: string;
  closingDay?: number;
  dueDay?: number;
}

interface UpdateAccountData {
  name?: string;
  type?: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  initialBalance?: number;
  color?: string;
  closingDay?: number;
  dueDay?: number;
}

export function useAccounts() {
  const queryClient = useQueryClient();

  const accountsQuery = useQuery({
    queryKey: ['accounts'],
    queryFn: accountsApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAccountData) => accountsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateAccountData }) =>
      accountsApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => accountsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
    },
  });

  return {
    accounts: accountsQuery.data || [],
    isLoading: accountsQuery.isLoading,
    isError: accountsQuery.isError,
    error: accountsQuery.error,
    refetch: accountsQuery.refetch,

    createAccount: createMutation.mutateAsync,
    isCreating: createMutation.isPending,

    updateAccount: updateMutation.mutateAsync,
    isUpdating: updateMutation.isPending,

    deleteAccount: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}
