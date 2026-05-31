# Dashboard Redesign Tasks

**Design**: `.specs/features/dashboard-redesign/design.md`
**Status**: Draft

---

## Execution Plan

### Phase 1: Foundation & Setup (Sequential)

Setup e preparação do ambiente.

```
T1 → T2 → T3
```

### Phase 2: Core Components - Left Column (Parallel OK)

Componentes da coluna esquerda podem ser desenvolvidos em paralelo.

```
       ┌→ T4 ─┐
       ├→ T5 ─┤
T3 ────┼→ T6 ─┼──→ T10
       └→ T7 ─┘
```

### Phase 3: Core Components - Right Column (Parallel OK)

Componentes da coluna direita podem ser desenvolvidos em paralelo.

```
       ┌→ T8 ─┐
T3 ────┼→ T9 ─┼──→ T11
       └→ T9b─┘
```

### Phase 4: Integration & Layout (Sequential)

Juntar tudo no DashboardPage.

```
T10 ──┬──→ T11 ──→ T12 ──→ T13
T11 ──┘
```

### Phase 5: Enhancement & Polish (Parallel OK)

Melhorias finais.

```
       ┌→ T14 ─┐
T13 ───┼→ T15 ─┼──→ T16
       └→ T16 ─┘
```

---

## Task Breakdown

### T1: Update CSS Variables and Design Tokens

**What**: Atualizar `index.css` com novas variáveis de cores, espaçamento e tokens do novo design

**Where**: `frontend/src/index.css`

**Depends on**: None

**Reuses**: Estrutura CSS atual

**Done when**:
- [ ] Variáveis `--color-primary`, `--color-primary-light`, `--color-primary-dark` atualizadas
- [ ] Variáveis de cards (`--color-card-income`, `--color-card-expense`) adicionadas
- [ ] Espaçamento `--card-padding`, `--grid-gap` definidos
- [ ] Verificação visual: rodar app e verificar que cores não quebraram componentes existentes

**Tests**: None (CSS visual)

**Gate**: `npm run build` - sem erros de compilação

---

### T2: Update Tailwind Config

**What**: Adicionar custom colors, shadows e border-radius ao `tailwind.config.js`

**Where**: `frontend/tailwind.config.js`

**Depends on**: T1

**Reuses**: Configuração Tailwind existente

**Done when**:
- [ ] Cores `primary`, `primary-light`, `primary-dark` adicionadas no `extend.colors`
- [ ] Shadows `card`, `card-hover` configuradas
- [ ] Border-radius `card` definido (16px)
- [ ] Build roda sem erros

**Tests**: None

**Gate**: `npm run build` - sem warnings de Tailwind

---

### T3: Install Missing Dependencies

**What**: Instalar `recharts` (gráficos) e `@headlessui/react` (modals) se não estiverem instalados

**Where**: `frontend/package.json`

**Depends on**: None

**Reuses**: NPM existente

**Done when**:
- [ ] `npm install recharts @headlessui/react clsx`
- [ ] Verificar `package.json` contém dependências
- [ ] Verificar `node_modules` sem erros

**Tests**: None

**Gate**: `npm run build` - dependências resolvem corretamente

---

### T4: Create SummaryCards Component [P]

**What**: Criar componente container que renderiza Income e Expense cards lado a lado

**Where**: `frontend/src/features/dashboard/components/SummaryCards.tsx`

**Depends on**: T2, T5

**Reuses**: Grid do Tailwind

**Done when**:
- [ ] Interface `SummaryCardsProps` definida (income, expense, changes, subtexts)
- [ ] Componente renderiza grid 2 colunas
- [ ] Aceita props e passa para StatCard filhos
- [ ] TypeScript compila sem erros

**Tests**: Unit test - renderiza 2 cards com props corretas

**Gate**: `npm run test -- SummaryCards.test.tsx`

---

### T5: Refactor StatCard Component [P]

**What**: Redesenhar `StatCard` para novo layout minimalista (sem gradientes complexos, mais limpo)

**Where**: `frontend/src/features/dashboard/components/StatCard.tsx`

**Depends on**: T2

**Reuses**: Lógica de formatação de moeda existente

**Done when**:
- [ ] Layout simplificado: ícone dropdown, título, valor, trend, subtext
- [ ] Props atualizadas: adicionar `subtext?: string`
- [ ] Remover backgrounds gradientes antigos
- [ ] Aplicar novas cores de `tailwind.config`
- [ ] Card responsivo (mobile/desktop)

**Tests**: Unit test - renderiza com diferentes props (income/expense, com/sem trend)

**Gate**: `npm run test -- StatCard.test.tsx`

---

### T6: Create CashFlowChart Component [P]

**What**: Criar gráfico de barras duplas (Cash In vs Cash Out) usando Recharts

**Where**: `frontend/src/features/dashboard/components/CashFlowChart.tsx`

**Depends on**: T3

**Reuses**: Recharts library

**Done when**:
- [ ] Interface `CashFlowChartProps` definida (data, period, onPeriodChange)
- [ ] BarChart renderiza barras duplas agrupadas por mês
- [ ] Dropdown de período funcional (This Year, Last Year)
- [ ] Tooltip mostra valores exatos no hover
- [ ] Cores: roxo (#6366f1) para In, roxo claro (#818cf8) para Out
- [ ] Mock data integrada para demonstração

**Tests**: Unit test - renderiza gráfico com dados mock, testa tooltip

**Gate**: `npm run test -- CashFlowChart.test.tsx`

---

### T7: Create RecentTransactionsTable Component [P]

**What**: Refatorar `RecentTransactions` de lista para tabela completa com sorting e search

**Where**: `frontend/src/features/dashboard/components/RecentTransactionsTable.tsx`

**Depends on**: T2

**Reuses**: Lógica de formatação de data/moeda existente

**Done when**:
- [ ] Tabela renderiza colunas: Transaction, Date, Amount, Category, Account, Status
- [ ] Click em header ordena coluna (asc/desc)
- [ ] Input de search filtra resultados em tempo real
- [ ] Filter button (placeholder - funcionalidade completa em T14)
- [ ] Status badge colorido (Success verde, Pending amarelo, Failed vermelho)
- [ ] Responsive: scroll horizontal em mobile

**Tests**: Unit test - renderiza tabela, testa sorting, testa search filter

**Gate**: `npm run test -- RecentTransactionsTable.test.tsx`

---

### T8: Create BalanceCard Component [P]

**What**: Criar card "My Balance" com valor principal e placeholder para mini chart

**Where**: `frontend/src/features/dashboard/components/BalanceCard.tsx`

**Depends on**: T2

**Reuses**: Formatação de moeda

**Done when**:
- [ ] Interface `BalanceCardProps` definida (balance, change, subtext, chartData)
- [ ] Card renderiza valor principal grande e centralizado
- [ ] Trend indicator com seta e percentual
- [ ] Subtext descritivo abaixo
- [ ] Placeholder div para mini chart (será preenchido em T14)
- [ ] Estilos consistentes com design de referência

**Tests**: Unit test - renderiza com diferentes balances e trends

**Gate**: `npm run test -- BalanceCard.test.tsx`

---

### T9: Create MyCardsSection Component [P]

**What**: Criar seção de cartões com visual de credit card e botões de ação

**Where**: `frontend/src/features/dashboard/components/MyCardsSection.tsx`

**Depends on**: T2, T9b

**Reuses**: Gradientes CSS, Lucide Icons

**Done when**:
- [ ] Interface `Card` definida (id, lastFourDigits, brand, expiryDate, holderName)
- [ ] Renderiza cartão visual com gradiente roxo
- [ ] Mostra últimos 4 dígitos e logo da bandeira
- [ ] Botão "+ Add card" funcional (onClick placeholder)
- [ ] Integra QuickActionButtons (T9b)
- [ ] Suporta múltiplos cartões (scroll horizontal ou stack)

**Tests**: Unit test - renderiza card, testa múltiplos cards

**Gate**: `npm run test -- MyCardsSection.test.tsx`

---

### T9b: Create QuickActionButtons Component [P]

**What**: Criar 4 botões circulares (Convert, Send, Receive, More) abaixo dos cartões

**Where**: `frontend/src/features/dashboard/components/QuickActionButtons.tsx`

**Depends on**: T2

**Reuses**: Lucide Icons (ArrowLeftRight, Send, Download, MoreHorizontal)

**Done when**:
- [ ] 4 botões renderizados em grid/flex horizontal
- [ ] Cada botão tem ícone correto e label
- [ ] onClick callback funcional (recebe tipo de ação)
- [ ] Styling: botões circulares com ícones centralizados
- [ ] Hover states aplicados

**Tests**: Unit test - renderiza 4 botões, testa onClick

**Gate**: `npm run test -- QuickActionButtons.test.tsx`

---

### T10: Update Dashboard API Types

**What**: Atualizar interfaces TypeScript do `dashboardApi` para incluir novos campos (cashFlow, balanceHistory)

**Where**: `frontend/src/features/dashboard/api/dashboardApi.ts` ou `types/dashboard.ts`

**Depends on**: None

**Reuses**: Tipos existentes de Transaction e Summary

**Done when**:
- [ ] Interface `DashboardStats` atualizada com campos opcionais:
  ```ts
  cashFlow?: Array<{ month: string; cashIn: number; cashOut: number }>;
  balanceHistory?: Array<{ date: string; value: number }>;
  ```
- [ ] Interface `PaymentCard` criada (para futura integração)
- [ ] TypeScript compila sem erros

**Tests**: None (tipos apenas)

**Gate**: `tsc --noEmit` - sem erros

---

### T11: Create Mock Data Utility

**What**: Criar utility function que gera mock data para cashFlow e balanceHistory enquanto backend não implementa

**Where**: `frontend/src/features/dashboard/utils/mockData.ts`

**Depends on**: T10

**Reuses**: Funções de geração de data

**Done when**:
- [ ] Função `generateMockCashFlow()` retorna array de 12 meses com valores
- [ ] Função `generateMockBalanceHistory()` retorna array de 30 dias com valores
- [ ] Função `generateMockCards()` retorna array de 1-2 cartões mock
- [ ] Valores realistas e variados (não sempre os mesmos)

**Tests**: Unit test - valida formato do mock data

**Gate**: `npm run test -- mockData.test.tsx`

---

### T12: Refactor DashboardPage Layout

**What**: Redesenhar layout do `DashboardPage` com grid 12 colunas e integrar novos componentes

**Where**: `frontend/src/features/dashboard/pages/DashboardPage.tsx`

**Depends on**: T4, T5, T6, T7, T8, T9, T10, T11

**Reuses**: useQuery existente, dashboardApi

**Done when**:
- [ ] Layout grid 12 colunas: 8 (left) + 4 (right)
- [ ] Integra SummaryCards no topo da coluna esquerda
- [ ] Integra CashFlowChart abaixo de SummaryCards
- [ ] Integra RecentTransactionsTable abaixo do chart
- [ ] Integra BalanceCard no topo da coluna direita
- [ ] Integra MyCardsSection abaixo do BalanceCard
- [ ] Remove componentes antigos: QuickActionCards, StockPortfolio, ActionSection
- [ ] Passa props corretas para todos componentes
- [ ] Usa mock data utility quando backend data não disponível

**Tests**: Integration test - carrega página completa, verifica todos componentes renderizados

**Gate**: `npm run test -- DashboardPage.test.tsx`

---

### T13: Refactor Sidebar Component

**What**: Redesenhar Sidebar para layout minimalista com ícones maiores e logo atualizado

**Where**: `frontend/src/components/layout/Sidebar.tsx`

**Depends on**: T2

**Reuses**: Estrutura de navegação existente

**Done when**:
- [ ] Logo redesenhado no topo (mais minimalista)
- [ ] Ícones maiores e mais espaçamento
- [ ] Estado ativo destacado (background roxo leve)
- [ ] Items de menu: Dashboard, Transações, Cartões, Histórico, Serviços, Ajuda
- [ ] Bottom section: Settings, Theme toggle (placeholder), User profile
- [ ] Responsive: collapse em mobile (<1024px)

**Tests**: Unit test - renderiza sidebar, testa navegação

**Gate**: `npm run test -- Sidebar.test.tsx`

---

### T14: Add MiniLineChart to BalanceCard [P]

**What**: Implementar mini gráfico de linha dentro do BalanceCard mostrando evolução de saldo

**Where**: `frontend/src/features/dashboard/components/MiniLineChart.tsx` + update BalanceCard

**Depends on**: T8, T11

**Reuses**: Recharts LineChart

**Done when**:
- [ ] MiniLineChart component criado com interface simples
- [ ] Renderiza linha compacta (altura ~100px) com dados de balanceHistory
- [ ] Gradiente abaixo da linha (área preenchida)
- [ ] Tooltip no hover (opcional - mini chart pode não ter)
- [ ] Integrado no BalanceCard
- [ ] Estilização minimalista (sem eixos visíveis, apenas linha)

**Tests**: Unit test - renderiza chart com mock data

**Gate**: `npm run test -- MiniLineChart.test.tsx`

---

### T15: Implement Advanced Filter Modal [P]

**What**: Criar modal de filtro avançado para RecentTransactionsTable com HeadlessUI

**Where**: `frontend/src/features/dashboard/components/TransactionFilterModal.tsx`

**Depends on**: T3, T7

**Reuses**: @headlessui/react Dialog

**Done when**:
- [ ] Modal abre ao clicar no botão Filter
- [ ] Campos: Date range picker, Category multiselect, Account multiselect, Amount range, Status
- [ ] Botões: Apply Filter, Clear Filters, Cancel
- [ ] Callback `onApplyFilters` retorna objeto de filtros
- [ ] Acessível: ESC fecha, focus trap, aria-labels

**Tests**: Unit test - abre/fecha modal, testa apply filters

**Gate**: `npm run test -- TransactionFilterModal.test.tsx`

---

### T16: Add Loading States and Skeletons [P]

**What**: Adicionar skeleton loaders para todos componentes principais durante carregamento

**Where**: Cada componente principal (StatCard, CashFlowChart, BalanceCard, MyCardsSection, RecentTransactionsTable)

**Depends on**: T12

**Reuses**: TailwindCSS animations

**Done when**:
- [ ] Skeleton para StatCard (retângulos cinza animados)
- [ ] Skeleton para CashFlowChart (barras placeholder)
- [ ] Skeleton para BalanceCard (texto placeholder)
- [ ] Skeleton para MyCardsSection (card placeholder)
- [ ] Skeleton para RecentTransactionsTable (rows placeholder)
- [ ] DashboardPage mostra skeletons quando `isLoading === true`

**Tests**: Unit test - verifica skeleton renderiza quando loading

**Gate**: `npm run test` - todos testes passam

---

### T17: Add Error States

**What**: Implementar estados de erro para quando API falhar ou dados não carregarem

**Where**: Todos componentes que dependem de dados externos

**Depends on**: T12

**Reuses**: Error boundaries React (se existir)

**Done when**:
- [ ] DashboardPage mostra mensagem de erro se `isError === true`
- [ ] Botão "Try Again" recarrega dados
- [ ] Erro logs no console para debug
- [ ] Toast notification ou alert inline (depende de biblioteca de notificações)

**Tests**: Unit test - simula erro de API, verifica UI de erro

**Gate**: `npm run test -- error-states`

---

### T18: Responsive Adjustments

**What**: Ajustar layout para mobile e tablet seguindo breakpoints definidos

**Where**: Todos componentes principais

**Depends on**: T13

**Reuses**: Breakpoints Tailwind (md:, lg:)

**Done when**:
- [ ] Mobile (<768px): Stack vertical, sidebar collapses
- [ ] Tablet (768-1024px): Grid 2 colunas
- [ ] Desktop (>1024px): Grid 3 colunas (8-4 split)
- [ ] Tabela scroll horizontal em mobile
- [ ] Cards ajustam tamanho em mobile
- [ ] Testado em DevTools responsivo

**Tests**: Visual test - screenshots em 3 breakpoints

**Gate**: Manual - carregar em 3 tamanhos de tela

---

### T19: Accessibility Audit

**What**: Auditar acessibilidade: keyboard nav, focus states, contraste, screen reader

**Where**: Todos componentes

**Depends on**: T18

**Reuses**: axe-core ou Lighthouse

**Done when**:
- [ ] Tab navigation funciona em todos componentes
- [ ] Focus states visíveis
- [ ] Contraste WCAG AA verificado
- [ ] Screen reader labels corretos
- [ ] ARIA attributes onde necessário
- [ ] Lighthouse accessibility score >90

**Tests**: E2E - teste de keyboard navigation completo

**Gate**: `npm run lighthouse` - accessibility >90

---

### T20: Final Integration Test

**What**: Teste E2E completo do dashboard redesenhado

**Where**: `frontend/cypress/e2e/dashboard-redesign.cy.ts` (ou similar)

**Depends on**: T19

**Reuses**: Cypress setup existente

**Done when**:
- [ ] Usuário loga e dashboard carrega
- [ ] Todos cards exibem dados corretos
- [ ] Gráfico renderiza e tooltip funciona
- [ ] Filtro de transações funciona
- [ ] Sidebar navega corretamente
- [ ] Responsivo testado
- [ ] Sem erros no console

**Tests**: E2E test completo

**Gate**: `npm run cypress:run`

---

## Pre-Approval Validation

### Check 1: Task Granularity ✅

| Task | Deliverable Count | Atomic? | Notes |
|------|-------------------|---------|-------|
| T1 | 1 file (index.css) | ✅ Yes | Single CSS file update |
| T2 | 1 file (tailwind.config.js) | ✅ Yes | Single config update |
| T3 | Package install | ✅ Yes | Single npm command |
| T4 | 1 component | ✅ Yes | SummaryCards container |
| T5 | 1 component refactor | ✅ Yes | StatCard redesign |
| T6 | 1 component | ✅ Yes | CashFlowChart |
| T7 | 1 component refactor | ✅ Yes | RecentTransactionsTable |
| T8 | 1 component | ✅ Yes | BalanceCard |
| T9 | 1 component | ✅ Yes | MyCardsSection |
| T9b | 1 component | ✅ Yes | QuickActionButtons |
| T10 | 1 file (types) | ✅ Yes | Type definitions |
| T11 | 1 utility file | ✅ Yes | Mock data generators |
| T12 | 1 page refactor | ✅ Yes | DashboardPage layout |
| T13 | 1 component refactor | ✅ Yes | Sidebar redesign |
| T14 | 1 component | ✅ Yes | MiniLineChart |
| T15 | 1 component | ✅ Yes | TransactionFilterModal |
| T16 | Multiple skeletons | ⚠️ Borderline | Could split per component, but skeletons são simples |
| T17 | Error states | ⚠️ Borderline | Acceptable - error handling é cross-cutting |
| T18 | Responsive | ⚠️ Borderline | Acceptable - CSS adjustments |
| T19 | Accessibility | ⚠️ Borderline | Acceptable - audit task |
| T20 | E2E test | ✅ Yes | Single test suite |

**Verdict**: ✅ PASS - All tasks are atomic or acceptably scoped for their nature

---

### Check 2: Diagram-Definition Cross-Check

| Task | Diagram Shows Depends On | Definition "Depends on" | Match? |
|------|-------------------------|------------------------|--------|
| T1 | None | None | ✅ |
| T2 | T1 | T1 | ✅ |
| T3 | None | None | ✅ |
| T4 | T3 | T2, T5 | ❌ Missing T3 in definition |
| T5 | T3 | T2 | ⚠️ Should depend on T3 |
| T6 | T3 | T3 | ✅ |
| T7 | T3 | T2 | ⚠️ Should depend on T3 |
| T8 | T3 | T2 | ⚠️ Should depend on T3 |
| T9 | T3 | T2, T9b | ⚠️ Should depend on T3 |
| T9b | T3 | T2 | ⚠️ Should depend on T3 |
| T10 | None | None | ✅ |
| T11 | T10 | T10 | ✅ |
| T12 | T10, T11 + all components | T4-T11 | ✅ |
| T13 | T2 | T2 | ✅ |
| T14 | T8, T11 | T8, T11 | ✅ |
| T15 | T3, T7 | T3, T7 | ✅ |
| T16 | T12 | T12 | ✅ |
| T17 | T12 | T12 | ✅ |
| T18 | T13 | T13 | ✅ |
| T19 | T18 | T18 | ✅ |
| T20 | T19 | T19 | ✅ |

**Issues Found**:
- Tasks T4, T5, T7, T8, T9, T9b devem depender de T3 (install dependencies) para garantir que recharts e headlessui estão disponíveis

**Action**: Corrigir dependências antes de aprovar

---

### Check 3: Test Co-location Validation

**Assumption**: TESTING.md não existe no projeto. Seguindo padrão React + Jest + React Testing Library.

| Task | Layer | Required Test Type | Tests Field | Co-located? | Gate Command |
|------|-------|-------------------|-------------|-------------|--------------|
| T1 | CSS | None (visual) | None | ✅ | npm run build |
| T2 | Config | None | None | ✅ | npm run build |
| T3 | Dependencies | None | None | ✅ | npm run build |
| T4 | Component | Unit | Unit test | ✅ | npm run test -- SummaryCards |
| T5 | Component | Unit | Unit test | ✅ | npm run test -- StatCard |
| T6 | Component | Unit | Unit test | ✅ | npm run test -- CashFlowChart |
| T7 | Component | Unit | Unit test | ✅ | npm run test -- RecentTransactionsTable |
| T8 | Component | Unit | Unit test | ✅ | npm run test -- BalanceCard |
| T9 | Component | Unit | Unit test | ✅ | npm run test -- MyCardsSection |
| T9b | Component | Unit | Unit test | ✅ | npm run test -- QuickActionButtons |
| T10 | Types | None | None | ✅ | tsc --noEmit |
| T11 | Utility | Unit | Unit test | ✅ | npm run test -- mockData |
| T12 | Page | Integration | Integration test | ✅ | npm run test -- DashboardPage |
| T13 | Component | Unit | Unit test | ✅ | npm run test -- Sidebar |
| T14 | Component | Unit | Unit test | ✅ | npm run test -- MiniLineChart |
| T15 | Component | Unit | Unit test | ✅ | npm run test -- TransactionFilterModal |
| T16 | Component | Unit | Unit test | ✅ | npm run test |
| T17 | Error handling | Unit | Unit test | ✅ | npm run test -- error-states |
| T18 | CSS/Responsive | Visual | Manual/Screenshots | ✅ | Manual |
| T19 | Accessibility | E2E/Lighthouse | E2E + Lighthouse | ✅ | npm run lighthouse |
| T20 | E2E | E2E | E2E test | ✅ | npm run cypress:run |

**Verdict**: ✅ PASS - All tasks have appropriate tests co-located

---

## Corrected Dependencies

**T4**: Depends on T2, T3, T5
**T5**: Depends on T2, T3
**T6**: Depends on T3
**T7**: Depends on T2, T3
**T8**: Depends on T2, T3
**T9**: Depends on T2, T3, T9b
**T9b**: Depends on T2, T3

---

## Summary

- **Total Tasks**: 20
- **Parallelizable**: 10 tasks (T4, T5, T6, T7, T8, T9, T9b, T14, T15, T16)
- **Estimated Time**: 
  - Phase 1 (Setup): 1-2 hours
  - Phase 2-3 (Components): 8-12 hours (parallelizado: 4-6 hours com múltiplos agents)
  - Phase 4 (Integration): 2-3 hours
  - Phase 5 (Polish): 3-4 hours
  - **Total**: 14-21 hours sequencial, 10-15 hours com paralelização

---

## Execution Strategy

**Recomendado**: 
1. Execute T1-T3 sequencialmente (setup rápido)
2. Lance 4-5 sub-agents em paralelo para T4-T9b (core components)
3. Execute T10-T13 sequencialmente (integration)
4. Lance 2-3 sub-agents para T14-T16 (enhancements)
5. Execute T17-T20 sequencialmente (final validation)

**Single Agent**: Execute tasks na ordem T1 → T20 (mais seguro, mais lento)

---

## Questions for User

1. **Backend API**: Os endpoints `/api/dashboard/stats` já retornam `cashFlow` e `balanceHistory`? Se não, T11 (mock data) será usado permanentemente ou é temporário?

2. **Cards Endpoint**: Existe endpoint `/api/cards` para buscar cartões do usuário? Se não, precisa ser criado no backend?

3. **Preferences**: Prefere execução paralela (mais rápido, múltiplos agents) ou sequencial (mais controlado, single agent)?

4. **MCPs/Skills Available**: Existem skills ou MCPs específicos para usar (ex: `frontend-design`, `web-design-guidelines`, `mermaid-studio`)?
