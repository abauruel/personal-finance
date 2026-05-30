// Application constants

export const APP_NAME = 'Personal Finance';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  TRANSACTIONS: '/transactions',
  ACCOUNTS: '/accounts',
  CATEGORIES: '/categories',
  RECURRING: '/recurring',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

export const QUERY_KEYS = {
  AUTH: 'auth',
  USER: 'user',
  ACCOUNTS: 'accounts',
  ACCOUNT: 'account',
  CATEGORIES: 'categories',
  CATEGORY: 'category',
  TRANSACTIONS: 'transactions',
  TRANSACTION: 'transaction',
  RECURRING: 'recurring',
  RECURRING_TRANSACTION: 'recurring-transaction',
  DASHBOARD: 'dashboard',
} as const;

export const ACCOUNT_TYPE_LABELS = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Conta Poupança',
  CREDIT_CARD: 'Cartão de Crédito',
} as const;

export const PAYMENT_TYPE_LABELS = {
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
  PIX: 'PIX',
  CASH: 'Dinheiro',
  TRANSFER: 'Transferência',
} as const;

export const TRANSACTION_STATUS_LABELS = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  CANCELLED: 'Cancelado',
} as const;

export const RECURRING_FREQUENCY_LABELS = {
  WEEKLY: 'Semanal',
  MONTHLY: 'Mensal',
  YEARLY: 'Anual',
} as const;

export const DEFAULT_PAGE_SIZE = 20;

export const DATE_FORMAT = 'dd/MM/yyyy';
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm';
