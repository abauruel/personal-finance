import type { Category } from '../../../types/models.types';
import { api } from '../../../lib/api';

interface CreateCategoryData {
  name: string;
  icon: string;
  color: string;
}

interface UpdateCategoryData {
  name?: string;
  icon?: string;
  color?: string;
}

export const categoriesApi = {
  async getAll(): Promise<Category[]> {
    const response = await api.get<Category[]>('/categories');
    return response.data;
  },

  async getById(id: string): Promise<Category> {
    const response = await api.get<Category>(`/categories/${id}`);
    return response.data;
  },

  async create(data: CreateCategoryData): Promise<Category> {
    const response = await api.post<Category>('/categories', data);
    return response.data;
  },

  async update(id: string, data: UpdateCategoryData): Promise<Category> {
    const response = await api.patch<Category>(`/categories/${id}`, data);
    return response.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
