# Frontend Structure Documentation

## 📁 Folder Structure

```
frontend/src/
├── features/              # Feature-based modules
│   ├── auth/
│   │   ├── components/   # Auth-specific components
│   │   ├── hooks/        # Auth-specific hooks
│   │   ├── api/          # Auth API calls
│   │   └── pages/        # Login, Register pages
│   ├── dashboard/
│   ├── transactions/
│   ├── accounts/
│   ├── categories/
│   ├── recurring/
│   └── reports/
│
├── components/
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Card.tsx
│   │   └── Modal.tsx
│   ├── layout/           # Layout components
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── MainLayout.tsx
│   └── common/           # Common components
│       ├── Loading.tsx
│       └── ErrorBoundary.tsx
│
├── lib/                  # Utilities and configurations
│   ├── api.ts           # Axios instance with interceptors
│   ├── utils.ts         # Helper functions
│   └── constants.ts     # App constants
│
├── store/                # Zustand state management
│   ├── authStore.ts     # Authentication state
│   ├── accountStore.ts  # Accounts state
│   └── transactionStore.ts # Transactions state
│
├── types/                # TypeScript type definitions
│   ├── models.types.ts  # Database models
│   ├── api.types.ts     # API request/response types
│   └── index.ts         # Type exports
│
├── routes/               # Routing configuration
│   ├── index.tsx        # Main router
│   └── PrivateRoute.tsx # Protected route guard
│
├── App.tsx              # App root
├── main.tsx             # Entry point
└── index.css            # Global styles (Tailwind)
```

## 🎨 Design System

### UI Components

All UI components are built with Tailwind CSS and support variants/sizes:

#### Button
- Variants: `primary`, `secondary`, `danger`, `ghost`
- Sizes: `sm`, `md`, `lg`
- Features: Loading state, disabled state

```tsx
<Button variant="primary" size="md" isLoading={false}>
  Click Me
</Button>
```

#### Input
- Features: Label, error messages, helper text, required indicator
- Full form integration support

```tsx
<Input
  label="Email"
  type="email"
  error={errors.email}
  helperText="Enter your email address"
  required
/>
```

#### Card
- Features: Title, subtitle, footer sections
- Flexible content area

```tsx
<Card title="Dashboard" subtitle="Overview">
  Content here
</Card>
```

#### Modal
- Sizes: `sm`, `md`, `lg`, `xl`
- Features: Backdrop click to close, ESC key support, body scroll lock

```tsx
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Create Transaction"
  size="md"
>
  Modal content
</Modal>
```

### Layout Components

#### MainLayout
Main application layout with Navbar and Sidebar. Used for all authenticated pages.

```tsx
<MainLayout>
  <YourPage />
</MainLayout>
```

#### Navbar
Top navigation bar with:
- App logo and name
- User profile (avatar with initials)
- Logout button

#### Sidebar
Left navigation menu with:
- Dashboard
- Transações
- Contas
- Categorias
- Recorrentes
- Relatórios

Active route highlighting with blue background.

## 🔐 Authentication Flow

### Auth Store (Zustand)
Persisted authentication state with localStorage:

```typescript
const { user, isAuthenticated, setAuth, clearAuth } = useAuthStore();

// Login
setAuth(user, accessToken, refreshToken);

// Logout
clearAuth();
```

### Private Routes
Protected routes require authentication:

```tsx
<Route
  path="/dashboard"
  element={
    <PrivateRoute>
      <MainLayout>
        <DashboardPage />
      </MainLayout>
    </PrivateRoute>
  }
/>
```

Unauthenticated users are redirected to `/login`.

## 🌐 API Client

### Configuration
Axios instance configured with:
- Base URL: `http://localhost:3000/api/v1` (from `.env`)
- Automatic JWT token injection
- Token refresh on 401 errors
- Request/response interceptors

```typescript
import api from '../lib/api';

// Automatically includes Bearer token
const response = await api.get('/transactions');
```

### Token Refresh
Automatic token refresh on 401:
1. Catches 401 error
2. Attempts refresh with `refreshToken`
3. Retries original request with new token
4. On failure, clears auth and redirects to login

## 📊 State Management

### Zustand Stores

#### Auth Store
- Persisted to localStorage
- User info, tokens, authentication status
- Login/logout actions

#### Account Store
- Accounts list
- Selected account
- CRUD operations

#### Transaction Store
- Transactions list
- Filters
- CRUD operations

### TanStack Query
Configured with:
- No refetch on window focus
- 1 retry
- 5 minute stale time

Used for server state management and caching.

## 🎯 Type Safety

### Model Types
Match Prisma schema exactly:
- `User`
- `Account`
- `Category`
- `Transaction`
- `RecurringTransaction`

### Const Objects (Not Enums)
Due to TypeScript `erasableSyntaxOnly` requirement:

```typescript
export const AccountType = {
  CHECKING: 'CHECKING',
  SAVINGS: 'SAVINGS',
  CREDIT_CARD: 'CREDIT_CARD',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];
```

### Type Imports
Use `import type` for type-only imports:

```typescript
import type { User } from '../types';
import type { ButtonHTMLAttributes } from 'react';
```

## 🛠️ Utilities

### formatCurrency(value: number)
Format numbers as Brazilian Real (R$):
```typescript
formatCurrency(1250.50) // "R$ 1.250,50"
```

### formatDate(date: Date | string)
Format dates as pt-BR:
```typescript
formatDate(new Date()) // "30/05/2026"
```

### cn(...classes)
Conditional classname helper:
```typescript
cn('base-class', condition && 'conditional-class', 'another-class')
```

### debounce(func, wait)
Debounce function execution:
```typescript
const debouncedSearch = debounce(handleSearch, 300);
```

### getCurrentMonthRange()
Get current month's start and end dates:
```typescript
const { start, end } = getCurrentMonthRange();
```

## 📖 Constants

### ROUTES
All application routes:
```typescript
ROUTES.HOME           // '/'
ROUTES.LOGIN          // '/login'
ROUTES.DASHBOARD      // '/dashboard'
ROUTES.TRANSACTIONS   // '/transactions'
// ... etc
```

### QUERY_KEYS
React Query keys for caching:
```typescript
QUERY_KEYS.ACCOUNTS        // 'accounts'
QUERY_KEYS.TRANSACTIONS    // 'transactions'
// ... etc
```

### Label Maps
Portuguese translations for enum values:
```typescript
ACCOUNT_TYPE_LABELS = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Conta Poupança',
  CREDIT_CARD: 'Cartão de Crédito',
}

PAYMENT_TYPE_LABELS = {
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
  PIX: 'PIX',
  // ... etc
}
```

## 🚀 Development

### Start Dev Server
```bash
cd frontend
npm run dev
```
Runs on `http://localhost:5173` (or next available port)

### Build for Production
```bash
npm run build
```
Output in `dist/` directory

### Preview Production Build
```bash
npm run preview
```

## 📦 Dependencies

### Core
- React 18
- TypeScript 5
- Vite 8

### Routing
- react-router-dom 6

### State Management
- zustand (UI state)
- @tanstack/react-query (server state)

### HTTP Client
- axios

### Styling
- tailwindcss 4 (@tailwindcss/postcss)

### Forms & Validation
- react-hook-form
- zod

### UI Enhancements
- sonner (toast notifications)
- lucide-react (icons)
- recharts (charts for dashboard)

### Utilities
- date-fns (date manipulation)

## 🎯 Next Steps

1. **Implement Authentication Pages**
   - Complete login form with validation
   - Complete register form with validation
   - Connect to backend API

2. **Build Dashboard**
   - Summary cards (balance, income, expenses)
   - Recent transactions list
   - Charts (spending by category, monthly trends)

3. **Implement CRUD Features**
   - Transactions management
   - Accounts management
   - Categories management
   - Recurring transactions

4. **Add Advanced Features**
   - Filters and search
   - Date range selection
   - Export to CSV/PDF
   - Multi-account support

5. **Polish & Testing**
   - Unit tests with Vitest
   - E2E tests with Playwright
   - Accessibility improvements
   - Performance optimization
   - Mobile responsiveness

## 📝 Code Style Guidelines

1. **Component Structure**
   - Use functional components
   - Props interfaces at top
   - Hooks after interface
   - Handlers after hooks
   - Return statement last

2. **Naming Conventions**
   - Components: PascalCase
   - Files: Match component name
   - Hooks: camelCase with `use` prefix
   - Constants: UPPER_SNAKE_CASE

3. **Imports Order**
   1. React
   2. External libraries
   3. Internal components
   4. Stores/hooks
   5. Types
   6. Utilities
   7. Styles

4. **Type Safety**
   - Always define prop interfaces
   - Use `type` for aliases
   - Use `interface` for objects
   - Prefer `import type` for type-only imports
   - No `any` types

## 🐛 Common Issues

### Build Errors
- Ensure all type imports use `import type`
- Check for unused React imports
- Verify Tailwind CSS v4 PostCSS plugin is installed

### Runtime Errors
- Check API base URL in `.env`
- Verify backend is running on port 3000
- Check browser console for detailed errors
- Verify tokens are stored in localStorage

### Style Issues
- Ensure Tailwind directives are in `index.css`
- Check PostCSS configuration
- Verify Tailwind config content paths
