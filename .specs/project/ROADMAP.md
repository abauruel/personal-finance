# Personal Finance Manager - Roadmap

**Project:** Personal Finance Manager  
**Version:** 1.0 - MVP  
**Last Updated:** May 30, 2026

---

## Roadmap Overview

```
Foundation → Core Features → Automation → Polish → Launch
  (Week 1-2)    (Week 3-6)      (Week 7-8)   (Week 9-10) (Week 11-12)
```

**Total Timeline:** 10-12 weeks (part-time)  
**Target MVP Launch:** August 2026

---

## Phase 0: Foundation (Week 1-2)

**Goal:** Setup técnico completo e base para desenvolvimento

### M0.1 - Project Setup ⏳
**Target:** Week 1  
**Status:** 🟡 In Progress

- [x] Definir estrutura de projeto (.specs)
- [x] Criar PROJECT.md
- [x] Criar ROADMAP.md
- [ ] Criar STATE.md
- [ ] Definir stack técnica final
- [ ] Setup repositório Git
- [ ] Configurar .gitignore
- [ ] Criar README.md

**Done When:**
- ✅ Estrutura .specs/ completa
- ✅ Documentação de projeto criada
- ✅ Git configurado e primeiro commit realizado

### M0.2 - Backend Foundation
**Target:** Week 1-2  
**Status:** 🔴 Not Started

- [ ] Inicializar projeto Node.js/TypeScript
- [ ] Setup Express/NestJS
- [ ] Configurar PostgreSQL
- [ ] Setup Prisma ORM
- [ ] Configurar estrutura de pastas
- [ ] Setup ESLint + Prettier
- [ ] Configurar variáveis de ambiente
- [ ] Criar docker-compose.yml para dev

**Done When:**
- ✅ Servidor rodando em localhost
- ✅ Conexão com banco de dados funcionando
- ✅ Health check endpoint respondendo
- ✅ Hot reload configurado

### M0.3 - Frontend Foundation
**Target:** Week 2  
**Status:** 🔴 Not Started

- [ ] Inicializar projeto Next.js/React
- [ ] Setup Tailwind CSS
- [ ] Configurar estrutura de pastas
- [ ] Criar layout base
- [ ] Setup de roteamento
- [ ] Configurar axios/fetch para API
- [ ] Setup de variáveis de ambiente

**Done When:**
- ✅ Aplicação rodando em localhost
- ✅ Hot reload funcionando
- ✅ Comunicação com backend estabelecida
- ✅ Layout base renderizando

---

## Phase 1: Core Features (Week 3-6)

**Goal:** Funcionalidades essenciais para substituir Excel

### M1.1 - Authentication (F001) 🔐
**Target:** Week 3  
**Status:** 🔴 Not Started  
**Priority:** P0 (Blocker)

**Features:**
- [ ] Registro de usuário (email + senha)
- [ ] Login
- [ ] Logout
- [ ] JWT token management
- [ ] Password hashing (bcrypt)
- [ ] Protected routes (middleware)
- [ ] Session management no frontend

**Done When:**
- ✅ Usuário pode se registrar
- ✅ Usuário pode fazer login/logout
- ✅ Rotas protegidas funcionando
- ✅ Token refresh implementado
- ✅ Validação de campos funcionando

**Tests:**
- Unit: Auth service
- Integration: Auth endpoints
- E2E: Fluxo completo de login

### M1.2 - Accounts Management (F002) 🏦
**Target:** Week 3  
**Status:** 🔴 Not Started  
**Priority:** P0 (Blocker)

**Features:**
- [ ] CRUD de contas bancárias
- [ ] CRUD de cartões de crédito
- [ ] Tipos: Conta Corrente, Poupança, Cartão
- [ ] Campos: Nome, Tipo, Saldo Inicial, Status
- [ ] Listagem de contas do usuário
- [ ] Seleção de conta padrão

**Done When:**
- ✅ Usuário pode criar/editar/excluir contas
- ✅ Listagem mostra todas as contas
- ✅ Validações de campos funcionando
- ✅ Não pode excluir conta com transações

**Tests:**
- Unit: Account service
- Integration: Account endpoints
- E2E: CRUD completo

### M1.3 - Categories (F003) 🏷️
**Target:** Week 4  
**Status:** 🔴 Not Started  
**Priority:** P0 (Blocker)

**Features:**
- [ ] 10 categorias predefinidas no seed
- [ ] CRUD de categorias personalizadas
- [ ] Campos: Nome, Ícone, Cor
- [ ] Validação: não excluir categorias em uso

**Categories:**
1. 🏠 Moradia
2. ⚡ Contas
3. 🍔 Alimentação
4. 🚗 Transporte
5. 🏥 Saúde
6. 🎓 Educação
7. 🎮 Lazer
8. 👕 Vestuário
9. 💰 Investimentos
10. 🎁 Outros

**Done When:**
- ✅ Categorias predefinidas criadas no seed
- ✅ Usuário pode criar categorias customizadas
- ✅ Não pode excluir categorias em uso
- ✅ Ícones e cores funcionando

### M1.4 - Transactions CRUD (F004) 💳
**Target:** Week 4-5  
**Status:** 🔴 Not Started  
**Priority:** P0 (Critical)

**Features:**
- [ ] Criar transação
- [ ] Editar transação
- [ ] Excluir transação (com confirmação)
- [ ] Listar transações
- [ ] Filtrar por: data, categoria, conta, tipo
- [ ] Buscar por descrição
- [ ] Paginação (20 por página)
- [ ] Ordenação por data/valor

**Fields:**
- Data (obrigatório)
- Valor (obrigatório)
- Descrição (obrigatório)
- Categoria (obrigatório)
- Conta (obrigatório)
- Tipo Pagamento: Débito, Crédito, PIX, Dinheiro, Transferência
- Status: Pendente, Pago, Cancelado
- É Recorrente: boolean
- Notas (opcional)

**Done When:**
- ✅ CRUD completo funcionando
- ✅ Validações de campos ok
- ✅ Filtros funcionando corretamente
- ✅ Busca retornando resultados corretos
- ✅ Paginação implementada
- ✅ Performance < 500ms

**Tests:**
- Unit: Transaction service (create, update, delete, list, filter)
- Integration: Transaction endpoints
- E2E: Fluxo completo de gerenciamento

### M1.5 - Dashboard Basic (F005) 📊
**Target:** Week 5  
**Status:** 🔴 Not Started  
**Priority:** P0 (Critical)

**Features:**
- [ ] Card: Saldo Total (soma de todas as contas)
- [ ] Card: Gastos do Mês
- [ ] Card: Receitas do Mês
- [ ] Card: Balanço (Receitas - Despesas)
- [ ] Gráfico: Gastos por Categoria (Pizza)
- [ ] Lista: Últimas 10 Transações
- [ ] Lista: Transações Pendentes

**Done When:**
- ✅ Dashboard carrega em < 2 segundos
- ✅ Todos os cards exibindo dados corretos
- ✅ Gráfico renderizando corretamente
- ✅ Dados atualizando ao criar transação
- ✅ Responsivo (desktop + mobile)

**Tests:**
- Unit: Dashboard calculations
- Integration: Dashboard endpoint
- E2E: Visualização completa

### M1.6 - Monthly Periods (F006) 📅
**Target:** Week 6  
**Status:** 🔴 Not Started  
**Priority:** P0 (Critical)

**Features:**
- [ ] Conceito de "período" (mês/ano)
- [ ] Filtro de transações por período
- [ ] Navegação entre períodos (anterior/próximo)
- [ ] Selector de mês/ano
- [ ] Dashboard atualiza com período selecionado

**Done When:**
- ✅ Usuário pode navegar entre meses
- ✅ Transações filtradas corretamente por período
- ✅ Dashboard reflete período selecionado
- ✅ Performance mantida com mudança de período

---

## Phase 2: Automation (Week 7-8)

**Goal:** Automatizar processos manuais e reduzir tempo de entrada

### M2.1 - Recurring Transactions (F007) 🔄
**Target:** Week 7  
**Status:** 🔴 Not Started  
**Priority:** P0 (Critical)

**Features:**
- [ ] CRUD de transações recorrentes
- [ ] Campos: todos de transação + frequência, dia do mês, data início/fim
- [ ] Frequência: Mensal, Semanal, Anual
- [ ] Status: Ativo/Inativo
- [ ] Listar todas as recorrentes
- [ ] Marcar transação existente como recorrente

**Done When:**
- ✅ Usuário pode criar despesas recorrentes
- ✅ Usuário pode editar/desativar recorrentes
- ✅ Listagem mostra todas as recorrentes ativas
- ✅ Validações funcionando

**Tests:**
- Unit: RecurringTransaction service
- Integration: Endpoints
- E2E: Gestão completa

### M2.2 - Auto-Generate Recurring (F008) ⚙️
**Target:** Week 7-8  
**Status:** 🔴 Not Started  
**Priority:** P0 (Critical)

**Features:**
- [ ] Job agendado (cron): roda todo dia 1 às 00:00
- [ ] Gerar transações de todas recorrentes ativas
- [ ] Status inicial: "Pendente"
- [ ] Vincular à recorrente original
- [ ] Log de gerações
- [ ] Endpoint manual para testar geração

**Done When:**
- ✅ Job agendado rodando automaticamente
- ✅ Transações recorrentes sendo geradas
- ✅ Status "Pendente" correto
- ✅ Usuário pode marcar como "Pago" facilmente
- ✅ Histórico de gerações acessível

**Tests:**
- Unit: Generation logic
- Integration: Job execution
- E2E: Fluxo mensal completo

### M2.3 - Payment Status Management (F009) ✅
**Target:** Week 8  
**Status:** 🔴 Not Started  
**Priority:** P1 (High)

**Features:**
- [ ] Marcar transação como "Paga" (1 clique)
- [ ] Registrar data efetiva de pagamento
- [ ] Ajustar valor se diferente do previsto
- [ ] Bulk actions: marcar múltiplas como pagas
- [ ] Indicadores visuais claros de status

**Done When:**
- ✅ Ação de marcar como pago < 2 cliques
- ✅ Ajuste de valor funcionando
- ✅ Bulk actions implementadas
- ✅ Indicadores visuais claros

---

## Phase 3: Enhancement (Week 9-10)

**Goal:** Melhorar UX e adicionar features que agregam valor

### M3.1 - Import Transactions (F010) 📥
**Target:** Week 9  
**Status:** 🔴 Not Started  
**Priority:** P1 (High)

**Features:**
- [ ] Upload de arquivo CSV
- [ ] Parser de CSV flexível
- [ ] Mapeamento de colunas
- [ ] Preview antes de importar
- [ ] Detecção de duplicatas
- [ ] Associar conta de destino
- [ ] Sugestão de categoria

**Done When:**
- ✅ Usuário consegue importar CSV
- ✅ Preview mostrando dados corretos
- ✅ Duplicatas sendo detectadas
- ✅ Importação criando transações corretamente

**Tests:**
- Unit: CSV parser
- Integration: Import endpoint
- E2E: Fluxo completo de importação

### M3.2 - Alerts & Notifications (F011) 🔔
**Target:** Week 9  
**Status:** 🔴 Not Started  
**Priority:** P1 (High)

**Features:**
- [ ] Alert: Despesas a vencer nos próximos 3 dias
- [ ] Alert: Despesas vencidas hoje
- [ ] Badge de notificações não lidas
- [ ] Lista de alertas pendentes
- [ ] Marcar alerta como lido

**Done When:**
- ✅ Alertas sendo gerados corretamente
- ✅ Badge mostrando contagem
- ✅ Usuário pode visualizar e dispensar alertas

### M3.3 - Monthly Report (F012) 📄
**Target:** Week 10  
**Status:** 🔴 Not Started  
**Priority:** P1 (High)

**Features:**
- [ ] Relatório completo do mês
- [ ] Total receitas vs despesas
- [ ] Gastos por categoria (valores + %)
- [ ] Comparação com mês anterior
- [ ] Lista de maiores despesas
- [ ] Exportar em PDF (opcional)

**Done When:**
- ✅ Relatório mostra dados corretos
- ✅ Comparação com mês anterior funcionando
- ✅ Visualização clara e profissional

---

## Phase 4: Polish & Testing (Week 11-12)

**Goal:** Preparar para produção

### M4.1 - UI/UX Polish 💅
**Target:** Week 11  
**Status:** 🔴 Not Started  
**Priority:** P1 (High)

- [ ] Revisar todos os componentes
- [ ] Consistência de estilos
- [ ] Loading states
- [ ] Empty states
- [ ] Error states
- [ ] Animations suaves
- [ ] Responsividade completa
- [ ] Modo escuro (opcional)

### M4.2 - Testing & QA 🧪
**Target:** Week 11-12  
**Status:** 🔴 Not Started  
**Priority:** P0 (Blocker)

- [ ] Cobertura de testes > 70%
- [ ] Todos os fluxos E2E testados
- [ ] Bug fixes
- [ ] Performance optimization
- [ ] Security audit básico
- [ ] LGPD compliance check

### M4.3 - Documentation 📚
**Target:** Week 12  
**Status:** 🔴 Not Started  
**Priority:** P1 (High)

- [ ] README.md completo
- [ ] Guia de instalação
- [ ] Documentação de API
- [ ] Guia do usuário básico
- [ ] Changelog

### M4.4 - Deployment 🚀
**Target:** Week 12  
**Status:** 🔴 Not Started  
**Priority:** P0 (Blocker)

- [ ] Escolher plataforma (Vercel, Railway, etc)
- [ ] Configurar CI/CD
- [ ] Setup de banco de dados production
- [ ] Configurar variáveis de ambiente
- [ ] Deploy backend
- [ ] Deploy frontend
- [ ] Setup de monitoramento básico
- [ ] Smoke tests em production

**Done When:**
- ✅ Aplicação acessível publicamente
- ✅ Funcionando sem erros
- ✅ Dados persistindo corretamente
- ✅ Performance aceitável

---

## MVP Launch ✨

**Target:** End of Week 12  
**Definition of Done:**

- ✅ Todas as features P0 implementadas e testadas
- ✅ Aplicação deployada e acessível
- ✅ Documentação completa
- ✅ Primeiro usuário (você) usando regularmente
- ✅ Excel substituído 100%

---

## Post-MVP (Future Phases)

### Phase 2: Improvements (3-4 weeks)
- Mobile responsiveness enhancement
- Sugestão inteligente de categorias (ML básico)
- Orçamentos por categoria
- Dashboard avançado com mais métricas
- Exportação de dados

### Phase 3: Intelligence (4-6 weeks)
- Análises e tendências
- Projeções futuras
- Identificação de gastos atípicos
- Recomendações de economia
- Integração Open Finance (se viável)

### Phase 4: Scale (TBD)
- App mobile nativo (React Native)
- Compartilhamento/finanças familiares
- Gestão de investimentos
- API pública
- White-label

---

## Feature Index

| ID | Feature | Phase | Status |
|----|---------|-------|--------|
| F001 | Authentication | 1 | 🔴 Not Started |
| F002 | Accounts Management | 1 | 🔴 Not Started |
| F003 | Categories | 1 | 🔴 Not Started |
| F004 | Transactions CRUD | 1 | 🔴 Not Started |
| F005 | Dashboard Basic | 1 | 🔴 Not Started |
| F006 | Monthly Periods | 1 | 🔴 Not Started |
| F007 | Recurring Transactions | 2 | 🔴 Not Started |
| F008 | Auto-Generate Recurring | 2 | 🔴 Not Started |
| F009 | Payment Status Management | 2 | 🔴 Not Started |
| F010 | Import Transactions | 3 | 🔴 Not Started |
| F011 | Alerts & Notifications | 3 | 🔴 Not Started |
| F012 | Monthly Report | 3 | 🔴 Not Started |

---

**Legend:**
- 🔴 Not Started
- 🟡 In Progress
- 🟢 Completed
- 🔵 Blocked
- ⚪ Deferred

**Priority:**
- P0: Blocker (must have for MVP)
- P1: High (important for MVP)
- P2: Medium (nice to have)
- P3: Low (future phases)

---

**Last Updated:** May 30, 2026  
**Next Review:** End of Phase 0
