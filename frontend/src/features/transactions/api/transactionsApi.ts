import api from '../../../lib/api';
import type {
  Transaction,
  CreateTransactionDto,
  UpdateTransactionDto,
} from '../../../types/models.types';

interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  accountId?: string;
  status?: string;
  paymentType?: string;
}

export const transactionsApi = {
  getAll: async (filters?: TransactionFilters): Promise<Transaction[]> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.categoryId) params.append('categoryId', filters.categoryId);
    if (filters?.accountId) params.append('accountId', filters.accountId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.paymentType) params.append('paymentType', filters.paymentType);

    const url = `/transactions${params.toString() ? `?${params.toString()}` : ''}`;
    const response = await api.get<Transaction[]>(url);
    return response.data;
  },

  getById: async (id: string): Promise<Transaction> => {
    const response = await api.get<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  create: async (data: CreateTransactionDto): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  update: async (
    id: string,
    data: UpdateTransactionDto,
  ): Promise<Transaction> => {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },
};
