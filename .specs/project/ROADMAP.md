# Personal Finance Manager - Roadmap

**Project:** Personal Finance Manager  
**Version:** 1.2 - MVP Execution  
**Last Updated:** June 4, 2026

---

## Roadmap Overview

```
Foundation -> Core Features -> Automation -> Enhancement -> Polish -> Launch
  (done)         (done)         (partial)      (partial)   (pending) (pending)
```

**Total Timeline (original):** 10-12 weeks (part-time)  
**Current Status:** Core MVP base entregue e operando localmente

---

## Current Snapshot (June 2026)

### Completed
- Foundation stack (backend, frontend, db, docker, docs base)
- Auth (register, login, refresh, profile)
- Accounts CRUD
- Categories CRUD
- Transactions CRUD com filtros e paginacao
- Dashboard API + tela principal
- Recurring CRUD + toggle + endpoint manual de geracao + job agendado

### In Progress
- Relatorios mensais (rota e tela base prontas, conteudo pendente)
- Acoes/filtros avancados no dashboard
- Importacao de extratos fase 1 (CSV MVP com preview e deduplicacao basica)

### Not Started
- Importacao de extratos fase 2 (OFX)
- Importacao de extratos fase 3 (PDF)
- Alertas e notificacoes
- Suite de testes automatizados no frontend

---

## Milestones

## M0 - Foundation
**Status:** Completed

- [x] Estrutura do projeto
- [x] Stack definida
- [x] Backend e frontend inicializados
- [x] Banco e migrations iniciais
- [x] Documentacao base

## M1 - Core Features
**Status:** Completed

- [x] F001 Authentication
- [x] F002 Accounts Management
- [x] F003 Categories
- [x] F004 Transactions CRUD
- [x] F005 Dashboard Basic
- [x] F006 Monthly tracking base (dados mensais no dashboard)

## M2 - Automation
**Status:** In Progress

- [x] F007 Recurring Transactions
- [x] F008 Auto-Generate Recurring (job + endpoint)
- [~] F009 Payment Status Management (status existe em transacoes; fluxo bulk/ux dedicado pendente)

## M3 - Enhancement
**Status:** In Progress

- [~] F010 Import Transactions (fases: CSV -> OFX -> PDF)
- [ ] F011 Alerts and Notifications
- [~] F012 Monthly Report (placeholder frontend)

## M4 - Polish and Release
**Status:** Not Started

- [ ] Padronizacao de UX e acessibilidade
- [ ] Testes automatizados frontend
- [ ] Revisao final de documentacao
- [ ] Deploy e smoke tests

---

## Next Sprint (Recommended)

1. Evoluir F010 para suporte OFX (mantendo CSV MVP)
2. Finalizar F012 relatorios mensais com dados de categorias e comparativo
3. Fechar F009 com acoes de status no frontend (incluindo fluxo rapido de marcar como pago)
4. Iniciar parser de PDF para importacao (fase 3 do F010)
5. Definir baseline de qualidade para frontend (lint + build + smoke + primeiros testes automatizados)

---

## Feature Index

| ID | Feature | Status |
|----|---------|--------|
| F001 | Authentication | Completed |
| F002 | Accounts Management | Completed |
| F003 | Categories | Completed |
| F004 | Transactions CRUD | Completed |
| F005 | Dashboard Basic | Completed |
| F006 | Monthly tracking base | Completed |
| F007 | Recurring Transactions | Completed |
| F008 | Auto-Generate Recurring | Completed |
| F009 | Payment Status Management | Partial |
| F010 | Import Transactions (CSV -> OFX -> PDF) | Partial |
| F011 | Alerts and Notifications | Not Started |
| F012 | Monthly Report | Partial |

---

## Status Legend

- Completed: funcional em backend e frontend principal
- Partial: existe base tecnica, mas ainda falta parte funcional/UX
- Not Started: sem implementacao relevante
