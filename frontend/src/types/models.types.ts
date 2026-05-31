// Database models matching Prisma schema

export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT_CARD: 'CREDIT_CARD',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const PaymentType = {
  DEBIT: 'DEBIT',
  CREDIT: 'CREDIT',
  PIX: 'PIX',
  CASH: 'CASH',
  TRANSFER: 'TRANSFER',
} as const;

export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const TransactionStatus = {
  PENDING: 'PENDING',
  PAID: 'PAID',
  CANCELLED: 'CANCELLED',
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const RecurringFrequency = {
  WEEKLY: 'WEEKLY',
  MONTHLY: 'MONTHLY',
  YEARLY: 'YEARLY',
} as const;

export type RecurringFrequency = (typeof RecurringFrequency)[keyof typeof RecurringFrequency];

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  initialBalance: number;
  currentBalance: number;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  userId: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId: string;
  categoryId: string;
  date: Date;
  amount: number;
  description: string;
  paymentType: PaymentType;
  status: TransactionStatus;
  isRecurring: boolean;
  recurringId?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  account?: Account;
  category?: Category;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  categoryId: string;
  accountId: string;
  description: string;
  amount: number;
  frequency: RecurringFrequency;
  paymentType: PaymentType;
  dayOfMonth: number;
  startDate: Date;
  endDate?: Date;
  active: boolean;
  lastGenerated?: Date;
  createdAt: Date;
  updatedAt: Date;
  category?: Category;
  account?: Account;
}

// DTOs for API requests
export interface CreateTransactionDto {
  accountId: string;
  categoryId: string;
  date: string;
  amount: number;
  description: string;
  paymentType: PaymentType;
  status?: TransactionStatus;
  notes?: string;
  isRecurring?: boolean;
  recurringId?: string;
}

export type UpdateTransactionDto = Partial<CreateTransactionDto>;

export interface CreateRecurringDto {
  categoryId: string;
  accountId: string;
  description: string;
  amount: number;
  frequency: RecurringFrequency;
  paymentType?: PaymentType;
  dayOfMonth: number;
  startDate: string;
  endDate?: string;
  active?: boolean;
}

export type UpdateRecurringDto = Partial<CreateRecurringDto>;
