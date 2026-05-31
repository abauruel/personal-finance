import api from '../../../lib/api';
import type {
  RecurringTransaction,
  CreateRecurringDto,
  UpdateRecurringDto,
} from '../../../types/models.types';

interface RecurringFilters {
  active?: boolean;
  frequency?: string;
  categoryId?: string;
  accountId?: string;
}

export const recurringApi = {
  getAll: async (filters?: RecurringFilters): Promise<RecurringTransaction[]> => {
    const params = new URLSearchParams();
    if (filters?.active !== undefined) params.append('active', String(filters.active));
    if (filters?.frequency) params.append('frequency', filters.frequency);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.accountId) params.append('accountId', filters.accountId);

    const url = `/recurring${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get<RecurringTransaction[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<RecurringTransaction> => {
    const response = await api.get<RecurringTransaction>(`/recurring/${id}`);
    return response.data;
  },

  create: async (data: CreateRecurringDto): Promise<RecurringTransaction> => {
    const response = await api.post<RecurringTransaction>('/recurring', data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateRecurringDto,
  ): Promise<RecurringTransaction> => {
    const response = await api.patch<RecurringTransaction>(`/recurring/${id}`, data);
    return response.data;
  },

  toggleActive: async (id: string): Promise<RecurringTransaction> => {
    const response = await api.patch<RecurringTransaction>(`/recurring/${id}/toggle`);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/recurring/${id}`);
  },

  hardDelete: async (id: string): Promise<void> => {
    await api.delete(`/recurring/${id}/hard`);
  },

  generate: async (): Promise<{ success: number; errors: number }> => {
    const response = await api.post<{ success: number; errors: number }>('/recurring/generate');
    return response.data;
  },
};
