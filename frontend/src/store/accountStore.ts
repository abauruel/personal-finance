import { create } from 'zustand';
import type { Account } from '../types';

interface AccountState {
  accounts: Account[];
  selectedAccount: Account | null;
  isLoading: boolean;
  setAccounts: (accounts: Account[]) => void;
  selectAccount: (account: Account | null) => void;
  addAccount: (account: Account) => void;
  updateAccount: (id: string, updates: Partial<Account>) => void;
  removeAccount: (id: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useAccountStore = create<AccountState>((set) => ({
  accounts: [],
  selectedAccount: null,
  isLoading: false,

  setAccounts: (accounts) => set({ accounts }),

  selectAccount: (account) => set({ selectedAccount: account }),

  addAccount: (account) =>
    set((state) => ({ accounts: [...state.accounts, account] })),

  updateAccount: (id, updates) =>
    set((state) => ({
      accounts: state.accounts.map((acc) =>
        acc.id === id ? { ...acc, ...updates } : acc
      ),
      selectedAccount:
        state.selectedAccount?.id === id
          ? { ...state.selectedAccount, ...updates }
          : state.selectedAccount,
    })),

  removeAccount: (id) =>
    set((state) => ({
      accounts: state.accounts.filter((acc) => acc.id !== id),
      selectedAccount:
        state.selectedAccount?.id === id ? null : state.selectedAccount,
    })),

  setLoading: (loading) => set({ isLoading: loading }),
}));
