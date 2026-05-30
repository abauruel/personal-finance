import type { Account } from '../../../types/models.types';
import { api } from '../../../lib/api';

interface CreateAccountData {
  name: string;
  type: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  initialBalance?: number;
}

interface UpdateAccountData {
  name?: string;
  type?: 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD';
  initialBalance?: number;
}

export const accountsApi = {
  async getAll(): Promise<Account[]> {
    const response = await api.get<Account[]>('/accounts');
    return response.data;
  },

  async getById(id: string): Promise<Account> {
    const response = await api.get<Account>(`/accounts/${id}`);
    return response.data;
  },

  async create(data: CreateAccountData): Promise<Account> {
    const response = await api.post<Account>('/accounts', data);
    return response.data;
  },

  async update(id: string, data: UpdateAccountData): Promise<Account> {
    const response = await api.patch<Account>(`/accounts/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/accounts/${id}`);
  },
};
