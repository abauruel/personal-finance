# Personal Finance Manager

Aplicacao web para gerenciamento de financas pessoais com foco em automacao de rotina mensal.

## Status Atual

- Fase atual: Core Features concluida, Automation em andamento
- Backend: modulos principais implementados (auth, accounts, categories, transactions, dashboard, recurring)
- Frontend: fluxo principal implementado; pagina de relatorios ainda em desenvolvimento

## Documentacao

- [PRD.md](PRD.md)
- [.specs/project/PROJECT.md](.specs/project/PROJECT.md)
- [.specs/project/ROADMAP.md](.specs/project/ROADMAP.md)
- [.specs/project/ARCHITECTURE.md](.specs/project/ARCHITECTURE.md)
- [.specs/project/STATE.md](.specs/project/STATE.md)
- [TESTING.md](TESTING.md)

## Stack Tecnica

### Backend
- NestJS 10 + TypeScript
- PostgreSQL + Prisma 7
- JWT + Passport + bcrypt
- Scheduler com @nestjs/schedule

### Frontend
- Vite 8 + React 19 + TypeScript
- Tailwind CSS 4
- TanStack Query + Zustand
- React Router 7

## Features MVP

### Implementadas
- Autenticacao (registro, login, refresh, profile)
- CRUD de contas
- CRUD de categorias
- CRUD de transacoes com filtros/paginacao
- Dashboard com cards, trend e transacoes recentes
- Recorrencias (CRUD + toggle + geracao manual e agendada)

### Em andamento
- Relatorios mensais (rota e pagina base prontas, conteudo pendente)

### Proximas
- Importacao de extratos (CSV/XLSX)
- Alertas e notificacoes
- Polimento de UX e cobertura de testes

## Como Rodar

### Pre-requisitos
- Node.js 24+
- PostgreSQL 15+

### Backend
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run prisma:seed
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Backend: http://localhost:3000/api/v1  
Frontend: http://localhost:5173

## Testes

Backend:
```bash
cd backend
npm run test
npm run test:e2e
npm run test:cov
```

Frontend:
- Atualmente sem suite automatizada configurada.
- Validacao atual via lint/build e cenarios manuais em [TESTING.md](TESTING.md).

## Progresso

- Base tecnica: 100%
- Core Features: 100%
- Automation: parcial
- Enhancement: parcial

## Autor

Alex Bauruel

---

Last Updated: June 2, 2026
Version: 0.2.0
