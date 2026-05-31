import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recurringApi } from '../api/recurringApi';
import type { CreateRecurringDto, UpdateRecurringDto } from '../../../types/models.types';

export const useRecurring = () => {
  const queryClient = useQueryClient();

  const recurringsQuery = useQuery({
    queryKey: ['recurring'],
    queryFn: () => recurringApi.getAll(),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRecurringDto) => recurringApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateRecurringDto }) =>
      recurringApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => recurringApi.toggleActive(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => recurringApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recurring'] });
    },
  });

  const generateMutation = useMutation({
    mutationFn: () => recurringApi.generate(),
  });

  return {
    recurrings: recurringsQuery.data || [],
    isLoading: recurringsQuery.isLoading,
    isError: recurringsQuery.isError,
    error: recurringsQuery.error,
    createRecurring: createMutation.mutateAsync,
    updateRecurring: updateMutation.mutateAsync,
    toggleRecurring: toggleMutation.mutateAsync,
    deleteRecurring: deleteMutation.mutateAsync,
    generateTransactions: generateMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isToggling: toggleMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isGenerating: generateMutation.isPending,
  };
};
