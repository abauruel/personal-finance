// API request and response types

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  statusCode: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

// Transactions
export interface CreateTransactionRequest {
  accountId: string;
  categoryId: string;
  date: string;
  amount: number;
  description: string;
  paymentType: string;
  status?: string;
}

export interface UpdateTransactionRequest {
  accountId?: string;
  categoryId?: string;
  date?: string;
  amount?: number;
  description?: string;
  paymentType?: string;
  status?: string;
}

export interface TransactionFilters {
  startDate?: string;
  endDate?: string;
  accountId?: string;
  categoryId?: string;
  status?: string;
  paymentType?: string;
}

// Accounts
export interface CreateAccountRequest {
  name: string;
  type: string;
  initialBalance: number;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
}

export interface UpdateAccountRequest {
  name?: string;
  creditLimit?: number;
  closingDay?: number;
  dueDay?: number;
}

// Categories
export interface CreateCategoryRequest {
  name: string;
  icon: string;
  color: string;
}

export interface UpdateCategoryRequest {
  name?: string;
  icon?: string;
  color?: string;
}

// Recurring Transactions
export interface CreateRecurringTransactionRequest {
  categoryId: string;
  accountId: string;
  description: string;
  amount: number;
  frequency: string;
  dayOfMonth?: number;
  startDate: string;
  endDate?: string;
}

export interface UpdateRecurringTransactionRequest {
  categoryId?: string;
  accountId?: string;
  description?: string;
  amount?: number;
  frequency?: string;
  dayOfMonth?: number;
  endDate?: string;
  active?: boolean;
}
