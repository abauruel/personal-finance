# Technical Architecture - Personal Finance Manager

**Last Updated:** May 30, 2026  
**Version:** 1.0

---

## System Overview

```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│                 │         │                 │         │                 │
│  Vite + React   │────────▶│   NestJS API    │────────▶│   PostgreSQL    │
│   (Frontend)    │  REST   │   (Backend)     │  Prisma │   (Database)    │
│                 │◀────────│                 │◀────────│                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
    Vercel                      Railway                    Railway
```

---

## Technology Stack

### Backend

**Framework:** NestJS 10.x
- TypeScript-first
- Modular architecture
- Built-in dependency injection
- Decorators for routes, validation, pipes

**Database:** PostgreSQL 15.x
- Relational database
- ACID compliant
- JSON support for flexible data
- Full-text search capabilities

**ORM:** Prisma 5.x
- Type-safe database client
- Schema migrations
- Introspection capabilities
- Query builder

**Authentication:** Custom JWT
- bcrypt for password hashing
- JSON Web Tokens for sessions
- Refresh token strategy
- Password reset flow

**Validation:** class-validator + class-transformer
- DTO validation
- Type transformation
- Custom validators

**Additional Libraries:**
- @nestjs/jwt - JWT utilities
- @nestjs/passport - Authentication strategies
- date-fns - Date manipulation
- node-cron - Scheduled jobs (recurring transactions)

### Frontend

**Framework:** Vite 5.x + React 18.x
- TypeScript
- Fast HMR (Hot Module Replacement)
- Optimized builds
- ES modules

**Styling:** Tailwind CSS 3.x
- Utility-first CSS
- Custom design system
- Dark mode support
- Responsive by default

**State Management:**
- **Zustand** - Global UI state (user, preferences, modals)
- **TanStack Query** - Server state (API calls, caching, invalidation)

**Routing:** React Router 6.x
- Client-side routing
- Protected routes
- Lazy loading

**Forms:** React Hook Form + Zod
- Performant form validation
- Type-safe schemas
- Integration with validation

**Charts:** Recharts
- Responsive charts
- Customizable
- Built for React

**Additional Libraries:**
- axios - HTTP client
- date-fns - Date utilities
- lucide-react - Icons
- sonner - Toast notifications
- cmdk - Command palette (future)

---

## Architecture Patterns

### Backend Architecture

**Layered Architecture:**

```
┌──────────────────────────────────────┐
│         Controllers Layer            │  ← HTTP routes, request/response
├──────────────────────────────────────┤
│          Services Layer              │  ← Business logic
├──────────────────────────────────────┤
│        Repositories Layer            │  ← Data access (Prisma)
├──────────────────────────────────────┤
│          Database (Prisma)           │  ← PostgreSQL
└──────────────────────────────────────┘
```

**Module Structure:**
```
src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── auth/
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/
│   │   ├── jwt.strategy.ts
│   │   └── local.strategy.ts
│   ├── guards/
│   │   └── jwt-auth.guard.ts
│   └── dto/
│       ├── login.dto.ts
│       └── register.dto.ts
├── users/
│   ├── users.module.ts
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── dto/
├── accounts/
│   ├── accounts.module.ts
│   ├── accounts.controller.ts
│   ├── accounts.service.ts
│   └── dto/
├── categories/
│   ├── categories.module.ts
│   ├── categories.controller.ts
│   ├── categories.service.ts
│   └── dto/
├── transactions/
│   ├── transactions.module.ts
│   ├── transactions.controller.ts
│   ├── transactions.service.ts
│   └── dto/
├── recurring-transactions/
│   ├── recurring-transactions.module.ts
│   ├── recurring-transactions.controller.ts
│   ├── recurring-transactions.service.ts
│   └── dto/
├── dashboard/
│   ├── dashboard.module.ts
│   ├── dashboard.controller.ts
│   └── dashboard.service.ts
├── reports/
│   ├── reports.module.ts
│   ├── reports.controller.ts
│   └── reports.service.ts
├── common/
│   ├── decorators/
│   ├── filters/
│   ├── interceptors/
│   ├── pipes/
│   └── guards/
└── prisma/
    ├── prisma.module.ts
    └── prisma.service.ts
```

### Frontend Architecture

**Feature-Based Structure:**

```
src/
├── main.tsx                   # Application entry
├── App.tsx                    # Root component
├── routes/                    # Route definitions
│   ├── index.tsx
│   ├── ProtectedRoute.tsx
│   └── PublicRoute.tsx
├── features/
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── RegisterForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   ├── api/
│   │   │   └── authApi.ts
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   ├── dashboard/
│   │   ├── components/
│   │   │   ├── DashboardCard.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   └── RecentTransactions.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts
│   │   ├── api/
│   │   │   └── dashboardApi.ts
│   │   └── pages/
│   │       └── DashboardPage.tsx
│   ├── transactions/
│   │   ├── components/
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── TransactionFilters.tsx
│   │   │   └── TransactionItem.tsx
│   │   ├── hooks/
│   │   │   ├── useTransactions.ts
│   │   │   └── useTransactionForm.ts
│   │   ├── api/
│   │   │   └── transactionsApi.ts
│   │   └── pages/
│   │       └── TransactionsPage.tsx
│   ├── accounts/
│   ├── categories/
│   ├── recurring/
│   └── reports/
├── components/               # Shared components
│   ├── ui/                  # Base UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Select.tsx
│   │   ├── Modal.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── layout/
│   │   ├── Layout.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── Footer.tsx
│   └── common/
│       ├── Loading.tsx
│       ├── ErrorBoundary.tsx
│       └── EmptyState.tsx
├── store/                   # Zustand stores
│   ├── authStore.ts
│   ├── uiStore.ts
│   └── index.ts
├── lib/                     # Utilities
│   ├── api.ts              # Axios instance
│   ├── queryClient.ts      # TanStack Query config
│   ├── utils.ts            # Helper functions
│   └── constants.ts        # App constants
├── types/                   # TypeScript types
│   ├── api.ts
│   ├── models.ts
│   └── index.ts
└── styles/
    └── index.css           # Global styles + Tailwind
```

---

## Database Schema

**Core Entities:**

```prisma
// prisma/schema.prisma

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  accounts              Account[]
  categories            Category[]
  transactions          Transaction[]
  recurringTransactions RecurringTransaction[]
}

model Account {
  id             String      @id @default(uuid())
  userId         String
  name           String
  type           AccountType
  initialBalance Float       @default(0)
  currentBalance Float       @default(0)
  active         Boolean     @default(true)
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions Transaction[]
  
  @@index([userId])
}

enum AccountType {
  CHECKING
  SAVINGS
  CREDIT_CARD
}

model Category {
  id        String   @id @default(uuid())
  userId    String
  name      String
  icon      String
  color     String
  isDefault Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  user                  User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  transactions          Transaction[]
  recurringTransactions RecurringTransaction[]
  
  @@index([userId])
}

model Transaction {
  id                   String            @id @default(uuid())
  userId               String
  accountId            String
  categoryId           String
  date                 DateTime
  amount               Float
  description          String
  paymentType          PaymentType
  status               TransactionStatus @default(PENDING)
  isRecurring          Boolean           @default(false)
  recurringId          String?
  notes                String?
  createdAt            DateTime          @default(now())
  updatedAt            DateTime          @updatedAt
  
  user                 User                   @relation(fields: [userId], references: [id], onDelete: Cascade)
  account              Account                @relation(fields: [accountId], references: [id], onDelete: Cascade)
  category             Category               @relation(fields: [categoryId], references: [id])
  recurringTransaction RecurringTransaction?  @relation(fields: [recurringId], references: [id])
  
  @@index([userId, date])
  @@index([accountId])
  @@index([categoryId])
}

enum PaymentType {
  DEBIT
  CREDIT
  PIX
  CASH
  TRANSFER
}

enum TransactionStatus {
  PENDING
  PAID
  CANCELLED
}

model RecurringTransaction {
  id           String    @id @default(uuid())
  userId       String
  categoryId   String
  accountId    String
  description  String
  amount       Float
  frequency    Frequency
  dayOfMonth   Int
  startDate    DateTime
  endDate      DateTime?
  active       Boolean   @default(true)
  lastGenerated DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  
  user         User          @relation(fields: [userId], references: [id], onDelete: Cascade)
  category     Category      @relation(fields: [categoryId], references: [id])
  transactions Transaction[]
  
  @@index([userId, active])
}

enum Frequency {
  WEEKLY
  MONTHLY
  YEARLY
}
```

---

## API Design

### REST API Endpoints

**Base URL:** `https://api.personalfinance.com/v1`

#### Authentication
```
POST   /auth/register     - Register new user
POST   /auth/login        - Login user
POST   /auth/logout       - Logout user
POST   /auth/refresh      - Refresh access token
POST   /auth/forgot       - Request password reset
POST   /auth/reset        - Reset password
GET    /auth/me           - Get current user
```

#### Accounts
```
GET    /accounts          - List all user accounts
POST   /accounts          - Create new account
GET    /accounts/:id      - Get account details
PATCH  /accounts/:id      - Update account
DELETE /accounts/:id      - Delete account
```

#### Categories
```
GET    /categories        - List all categories
POST   /categories        - Create category
GET    /categories/:id    - Get category
PATCH  /categories/:id    - Update category
DELETE /categories/:id    - Delete category
```

#### Transactions
```
GET    /transactions                 - List transactions (with filters)
POST   /transactions                 - Create transaction
GET    /transactions/:id             - Get transaction
PATCH  /transactions/:id             - Update transaction
DELETE /transactions/:id             - Delete transaction
POST   /transactions/import          - Import from CSV
PATCH  /transactions/:id/mark-paid   - Mark as paid
```

**Query Parameters:**
- `startDate`, `endDate` - Filter by date range
- `categoryId` - Filter by category
- `accountId` - Filter by account
- `status` - Filter by status
- `search` - Search in description
- `page`, `limit` - Pagination
- `sort`, `order` - Sorting

#### Recurring Transactions
```
GET    /recurring                     - List recurring transactions
POST   /recurring                     - Create recurring transaction
GET    /recurring/:id                 - Get recurring transaction
PATCH  /recurring/:id                 - Update recurring transaction
DELETE /recurring/:id                 - Delete recurring transaction
POST   /recurring/generate            - Manually trigger generation
```

#### Dashboard
```
GET    /dashboard                     - Get dashboard data
GET    /dashboard/summary             - Get financial summary
GET    /dashboard/by-category         - Get spending by category
GET    /dashboard/recent              - Get recent transactions
```

#### Reports
```
GET    /reports/monthly/:year/:month  - Get monthly report
GET    /reports/comparison            - Compare periods
GET    /reports/export                - Export data
```

### Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Optional success message"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is invalid"
      }
    ]
  }
}
```

**Pagination Response:**
```json
{
  "success": true,
  "data": [ /* items */ ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## Security

### Authentication Flow

1. User submits email + password
2. Backend validates credentials
3. If valid, generates:
   - Access token (JWT, 15 minutes)
   - Refresh token (JWT, 7 days)
4. Tokens stored in httpOnly cookies
5. Frontend uses access token for API calls
6. When access token expires, use refresh token
7. Refresh endpoint returns new access token

### Password Security

- bcrypt with salt rounds: 10
- Minimum 8 characters
- Password reset via email token (expires in 1 hour)

### API Security

- CORS configured for frontend domain only
- Rate limiting: 100 requests/15 minutes per IP
- Helmet.js for security headers
- Input validation on all endpoints
- SQL injection prevention (Prisma parameterized queries)
- XSS protection (sanitize inputs)

### Data Privacy

- Passwords never stored in plain text
- Sensitive data encrypted at rest
- HTTPS only in production
- Audit logs for sensitive operations
- LGPD compliance:
  - User can export data
  - User can delete account (cascade delete)
  - Clear privacy policy

---

## Deployment Architecture

### Frontend (Vercel)

```
GitHub Push → Vercel Build → Deploy to CDN
                ↓
        - Build Vite app
        - Optimize assets
        - Generate static files
```

**Environment Variables:**
- `VITE_API_URL` - Backend API URL

**Features:**
- Automatic HTTPS
- Global CDN
- Preview deployments for PRs
- Custom domain support

### Backend (Railway)

```
GitHub Push → Railway Build → Deploy Container → PostgreSQL
                ↓
        - Build NestJS app
        - Run migrations
        - Start server
```

**Environment Variables:**
- `DATABASE_URL` - PostgreSQL connection
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token secret
- `FRONTEND_URL` - CORS origin
- `NODE_ENV` - Environment (production)

**Features:**
- Automatic PostgreSQL setup
- Health checks
- Zero-downtime deployments
- Automatic SSL

---

## Scheduled Jobs

**Recurring Transaction Generator:**
- **Frequency:** Daily at 00:00 UTC
- **Logic:** Check all active recurring transactions, generate if due
- **Implementation:** node-cron in NestJS
- **Monitoring:** Log all generations + failures

```typescript
// Cron expression: "0 0 * * *" (daily at midnight)
@Cron('0 0 * * *')
async generateRecurringTransactions() {
  // Find all active recurring transactions
  // Check if generation is due (based on lastGenerated + frequency)
  // Create new transactions with status PENDING
  // Update lastGenerated timestamp
  // Send notification to users
}
```

---

## Performance Considerations

### Backend

- **Database Indexes:** On userId, date, categoryId, accountId
- **Query Optimization:** Prisma select only needed fields
- **Caching:** Redis for dashboard data (future)
- **Pagination:** Default 20 items, max 100
- **Connection Pooling:** Prisma default pool

### Frontend

- **Code Splitting:** Lazy load routes
- **Image Optimization:** WebP format, lazy loading
- **Bundle Size:** Target < 200KB gzipped
- **Caching:** TanStack Query with staleTime
- **Debouncing:** Search inputs debounced 300ms

### API Response Times

- **Target:** P95 < 500ms
- **Dashboard:** < 1000ms (complex aggregations)
- **List endpoints:** < 300ms
- **CRUD operations:** < 200ms

---

## Monitoring & Observability

### Metrics to Track

- API response times
- Error rates
- Database query performance
- User activity (DAU, MAU)
- Feature usage
- Failed job executions

### Logging

- Structured JSON logs
- Log levels: ERROR, WARN, INFO, DEBUG
- Sensitive data redacted
- Request/response logging (excludes body)

### Error Tracking

- Backend: NestJS exception filters
- Frontend: ErrorBoundary components
- Future: Integrate Sentry or similar

---

## Testing Strategy

### Backend

- **Unit Tests:** Services (business logic)
- **Integration Tests:** Controllers + Database
- **E2E Tests:** Full API flows
- **Coverage Target:** > 70%

**Tools:**
- Jest
- Supertest
- Prisma test database

### Frontend

- **Unit Tests:** Utilities, hooks
- **Component Tests:** React Testing Library
- **E2E Tests:** Critical user flows
- **Coverage Target:** > 60%

**Tools:**
- Vitest
- React Testing Library
- Playwright (E2E)

---

## Development Workflow

### Local Development

**Backend:**
```bash
cd backend
npm install
docker-compose up -d  # Start PostgreSQL
npx prisma migrate dev
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### Git Workflow

- **Main branch:** Production-ready code
- **Develop branch:** Integration branch
- **Feature branches:** `feature/feature-name`
- **Commit convention:** Conventional Commits
  - `feat:` new feature
  - `fix:` bug fix
  - `docs:` documentation
  - `refactor:` code refactoring
  - `test:` tests
  - `chore:` maintenance

### CI/CD Pipeline

**On Push to Main:**
1. Run tests
2. Build application
3. Deploy to production (Railway + Vercel)

**On Pull Request:**
1. Run tests
2. Build check
3. Preview deployment (Vercel)

---

## Future Enhancements

### Phase 2
- Redis caching for dashboard
- WebSocket for real-time updates
- Background job queue (Bull)

### Phase 3
- Microservices architecture
- GraphQL API
- Mobile app (React Native)
- Open Finance integration

### Phase 4
- Multi-tenancy
- Advanced analytics with BigQuery
- Machine learning for categorization
- Event sourcing for audit trail

---

**Last Updated:** May 30, 2026  
**Next Review:** After MVP completion
