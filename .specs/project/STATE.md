# Project State - Personal Finance Manager

**Last Updated:** June 4, 2026  
**Current Phase:** Automation / Enhancement  
**Current Sprint Focus:** Reports + Import (CSV -> OFX -> PDF) + Quality baseline

---

## Active Work

### Current Focus
- Finalizar relatorios mensais no frontend
- Evoluir importacao de extrato em fases (CSV MVP -> OFX -> PDF)
- Consolidar qualidade minima para frontend

### In Progress
- [~] Reports page: rota pronta, tela placeholder
- [~] Dashboard: acoes principais conectadas e filtro com redirecionamento para transacoes
- [~] F010 Importacao: CSV MVP com preview e deduplicacao basica implementado

### Stable and Implemented
- [x] Backend modules: auth, accounts, categories, transactions, dashboard, recurring
- [x] Frontend pages: auth, dashboard, accounts, categories, transactions, recurring
- [x] Recurring generation cron job + trigger manual via endpoint
- [x] Sidebar sem rotas quebradas (History/Help removidos) e toggle de tema com persistencia

---

## Key Decisions (Current)

### D004 - Keep Monorepo Structure
**Date:** June 2, 2026  
**Decision:** Continuar com backend e frontend no mesmo repositório.  
**Rationale:** simplifica desenvolvimento solo, alinhamento de contrato API e docs.

### D005 - Reports as Next User-Facing Priority
**Date:** June 2, 2026  
**Decision:** Priorizar fechamento de relatorios antes de features de notificacao.  
**Rationale:** entrega valor direto de analise financeira e reduz gap visivel de produto.

---

## Active Blockers

No hard blockers.

## Risks
- Frontend sem testes automatizados pode aumentar regressao em features novas.
- Divergencia de docs e implementacao pode gerar retrabalho de planejamento.
- Importacao PDF pode exigir OCR/normalizacao dependendo do layout dos bancos.

---

## Known Issues

- Endpoint/manual generation de recorrentes retorna contadores simplificados (0/0) no retorno manual.
- Reports page ainda nao consome dados reais.
- Importacao CSV atual nao cobre todos os formatos complexos (ex.: campos com delimitadores entre aspas).

---

## Progress Metrics

### MVP Feature Progress
- Completed: 8/12
- Partial: 3/12
- Not Started: 1/12

### Phase Progress
- Foundation: 100%
- Core Features: 100%
- Automation: 75%
- Enhancement: 45%
- Polish: 10%

### Quality and Ops
- Backend automated tests: available (unit/e2e/coverage scripts)
- Frontend automated tests: not configured
- CI/CD: not configured

---

## Recent Changes (Snapshot)

### June 2026
- Core backend/frontend modules stabilized
- Recurring transaction workflow implemented (CRUD + generation)
- Dashboard integrated with backend stats
- Sidebar/navigation cleaned and theme toggle persisted
- CSV import MVP added in transactions (preview + basic deduplication)
- Documentation synchronized with real implementation status

---

## Next Milestones

### Sprint A
- [ ] Finalizar relatorios com dados reais
- [ ] Evoluir F010 para suporte OFX (mantendo CSV MVP)
- [ ] Iniciar parser de PDF para importacao (fase 3)

### Sprint B
- [ ] Fechar status de pagamento no fluxo de UX (acao rapida e visibilidade)
- [ ] Adicionar primeira bateria de testes frontend

### Sprint C
- [ ] Preparar deploy com checklist de smoke tests

---

## Deferred Ideas

- OCR de recibos
- Open Finance integration
- Orcamentos por categoria
- Multi-currency
- Family/shared accounts
