# Personal Finance Manager 💰

Modern web application for personal finance management with automation and intelligent insights.

## 🎯 Project Overview

An application that automates personal finance tracking, eliminating manual Excel work with features like:
- ✅ Automated monthly period management
- ✅ Smart recurring transactions
- ✅ Real-time dashboard
- ✅ Intelligent categorization
- ✅ Multi-account/card support

**Status:** 🟡 In Development - Phase 0 (Foundation)  
**Timeline:** 12 weeks to MVP (Week 1 of 12)

## 📚 Documentation

- [PRD.md](PRD.md) - Product Requirements Document
- [.specs/project/PROJECT.md](.specs/project/PROJECT.md) - Project Definition
- [.specs/project/ROADMAP.md](.specs/project/ROADMAP.md) - Feature Roadmap
- [.specs/project/ARCHITECTURE.md](.specs/project/ARCHITECTURE.md) - Technical Architecture
- [.specs/project/STATE.md](.specs/project/STATE.md) - Current Project State

## 🛠️ Tech Stack

### Backend
- **Framework:** NestJS 10.x + TypeScript
- **Database:** PostgreSQL 15.x
- **ORM:** Prisma 5.x
- **Auth:** JWT + bcrypt
- **Deployment:** Railway

### Frontend
- **Framework:** Vite 5.x + React 18.x + TypeScript
- **Styling:** Tailwind CSS 3.x
- **State:** Zustand + TanStack Query
- **Routing:** React Router 6.x
- **Deployment:** Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 24.x
- PostgreSQL 15.x
- npm or yarn

### Installation

**Backend:**
```bash
cd backend
npm install
cp .env.example .env
# Configure DATABASE_URL in .env
npx prisma migrate dev
npm run start:dev
```

**Frontend:**
```bash
cd frontend
npm install
cp .env.example .env
# Configure VITE_API_URL in .env
npm run dev
```

### Development

Backend runs on: `http://localhost:3000`  
Frontend runs on: `http://localhost:5173`

## 📁 Project Structure

```
personal-finance/
├── .specs/                    # Project documentation
│   ├── project/              # Core project docs
│   ├── features/             # Feature specifications
│   └── quick/                # Ad-hoc task tracking
├── backend/                  # NestJS API
│   ├── src/
│   ├── prisma/
│   └── test/
├── frontend/                 # React SPA
│   ├── src/
│   └── public/
├── PRD.md                    # Product Requirements
├── Oportunidade.md           # Original problem statement
└── README.md                 # This file
```

## 🎯 MVP Features (12 weeks)

### Phase 1: Core Features (Week 3-6)
- [x] Authentication
- [x] Account Management
- [x] Categories
- [x] Transactions CRUD
- [x] Basic Dashboard
- [x] Monthly Periods

### Phase 2: Automation (Week 7-8)
- [ ] Recurring Transactions
- [ ] Auto-Generate Recurring
- [ ] Payment Status Management

### Phase 3: Enhancement (Week 9-10)
- [ ] Import Transactions
- [ ] Alerts & Notifications
- [ ] Monthly Reports

### Phase 4: Polish (Week 11-12)
- [ ] UI/UX Polish
- [ ] Testing & QA
- [ ] Documentation
- [ ] Deployment

## 🧪 Testing

```bash
# Backend
cd backend
npm run test           # Unit tests
npm run test:e2e       # E2E tests
npm run test:cov       # Coverage

# Frontend
cd frontend
npm run test           # Unit tests
npm run test:e2e       # Playwright E2E
```

## 📊 Progress

- **Overall:** 0% (0/12 features)
- **Phase 0 (Foundation):** 90% (in progress)
- **Timeline:** On track

## 🤝 Contributing

This is a personal project, but suggestions are welcome! Feel free to open issues.

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Alex Bauruel**

## 🔗 Links

- [Live App](https://personalfinance.app) _(coming soon)_
- [API Docs](https://api.personalfinance.app/docs) _(coming soon)_

---

**Last Updated:** May 30, 2026  
**Version:** 0.1.0 (Pre-Alpha)
