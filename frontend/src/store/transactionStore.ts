import { create } from 'zustand';
import type { Transaction, TransactionFilters } from '../types';

interface TransactionState {
  transactions: Transaction[];
  filters: TransactionFilters;
  isLoading: boolean;
  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (id: string, updates: Partial<Transaction>) => void;
  removeTransaction: (id: string) => void;
  setFilters: (filters: TransactionFilters) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  filters: {},
  isLoading: false,

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: (id, updates) =>
    set((state) => ({
      transactions: state.transactions.map((tx) =>
        tx.id === id ? { ...tx, ...updates } : tx
      ),
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((tx) => tx.id !== id),
    })),

  setFilters: (filters) => set({ filters }),

  clearFilters: () => set({ filters: {} }),

  setLoading: (loading) => set({ isLoading: loading }),
}));
