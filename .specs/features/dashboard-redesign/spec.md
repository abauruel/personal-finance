# Dashboard Redesign Specification

## Problem Statement

O dashboard atual possui layout fragmentado com espaçamento inconsistente e hierarquia visual pouco clara. O novo design (baseado em Fireart Studio) oferece uma experiência mais limpa, profissional e focada, com melhor organização das informações financeiras e navegação mais intuitiva.

## Goals

- [ ] Redesenhar dashboard com layout minimalista e hierarquia visual clara baseado no design de referência
- [ ] Manter todas as funcionalidades existentes (visualização de transações, cards de resumo, gráficos)
- [ ] Melhorar UX com navegação sidebar simplificada e cards mais informativos
- [ ] Entregar interface profissional alinhada com padrões modernos de design financeiro

## Out of Scope

| Feature | Reason |
|---------|--------|
| Nova funcionalidade de cartões (gerenciamento de múltiplos cartões) | Focando apenas em redesign visual, novas features são fase 2 |
| Integração real com dados bancários | Mantém mock data existente, integração é outro projeto |
| Animações complexas e microinterações | Prioridade é layout e usabilidade, animações são refinamento posterior |
| Modo escuro (dark mode) | Implementação futura, focando em versão light primeiro |

---

## User Stories

### P1: Layout Principal com Cards de Resumo ⭐ MVP

**User Story**: Como usuário, quero ver meu resumo financeiro (Income, Expense, Balance) em cards destacados no topo do dashboard para ter uma visão rápida da minha situação financeira.

**Why P1**: É a primeira informação que o usuário precisa ver ao acessar o dashboard - essencial para qualquer app financeiro.

**Acceptance Criteria**:

1. WHEN usuário acessa o dashboard THEN sistema SHALL exibir 3 cards no topo: Income (esquerda), Expense (centro-esquerda), My Balance (direita)
2. WHEN dados são carregados THEN cada card SHALL mostrar valor principal, subtexto informativo e percentual de variação com ícone direcional
3. WHEN card de Income/Expense tem valor positivo THEN SHALL exibir cor verde e seta para cima
4. WHEN card de Expense tem overspending THEN SHALL exibir valor em vermelho
5. WHEN hover sobre card THEN SHALL aplicar sutil efeito de elevação (shadow)

**Independent Test**: Carregar dashboard e verificar se 3 cards aparecem com valores corretos, formatação de moeda e indicadores visuais de tendência.

---

### P1: Sidebar de Navegação Minimalista ⭐ MVP

**User Story**: Como usuário, quero uma barra lateral com ícones claros para navegar entre seções do app de forma rápida e intuitiva.

**Why P1**: Navegação é fundamental - sem sidebar funcional o usuário não consegue usar a aplicação.

**Acceptance Criteria**:

1. WHEN aplicação carrega THEN sistema SHALL exibir sidebar fixa à esquerda com logo no topo
2. WHEN usuário visualiza sidebar THEN SHALL ver ícones para: Dashboard, Transações, Cartões, Histórico, Serviços, Ajuda, Configurações
3. WHEN usuário clica em item da sidebar THEN sistema SHALL destacar item ativo e navegar para página correspondente
4. WHEN em tela pequena (<1024px) THEN sidebar SHALL ser ocultável/colapsável
5. WHEN sidebar está ativa THEN item atual SHALL ter indicador visual (background highlight)

**Independent Test**: Clicar em cada item da sidebar e verificar navegação + estado ativo correto.

---

### P1: Gráfico de Cash In/Cash Out ⭐ MVP

**User Story**: Como usuário, quero visualizar um gráfico de barras comparando entradas e saídas mensais para entender meu fluxo de caixa ao longo do tempo.

**Why P1**: Visualização de fluxo de caixa é core feature do app financeiro - usuário precisa ver tendências.

**Acceptance Criteria**:

1. WHEN dashboard carrega THEN sistema SHALL exibir gráfico de barras duplas (In/Out) no centro-esquerda
2. WHEN usuário visualiza gráfico THEN SHALL ver barras agrupadas por mês com escala de valores no eixo Y
3. WHEN usuário seleciona dropdown "This Years" THEN SHALL poder filtrar período (This Year, Last Year, Custom)
4. WHEN hover sobre barra THEN sistema SHALL exibir tooltip com valor exato e mês
5. WHEN dados de um mês são clicados THEN SHALL mostrar detalhamento do período (May 2023 exemplo)

**Independent Test**: Visualizar gráfico com dados mock, interagir com tooltip e validar que valores correspondem aos cards de resumo.

---

### P1: Seção My Cards ⭐ MVP

**User Story**: Como usuário, quero ver meus cartões cadastrados com últimos 4 dígitos e ações rápidas (Convert, Send, Receive, More) para gerenciar rapidamente minhas finanças.

**Why P1**: Gestão de cartões é diferencial visual do novo design e funcionalidade core.

**Acceptance Criteria**:

1. WHEN dashboard carrega THEN sistema SHALL exibir seção "My Cards" no lado direito abaixo de Balance
2. WHEN usuário visualiza cards THEN SHALL ver cartão(s) com número parcial (exp: 9876) e bandeira (VISA)
3. WHEN usuário visualiza ações THEN SHALL ver 4 botões circulares: Convert, Send, Receive, More com ícones
4. WHEN usuário clica em "+ Add card" THEN sistema SHALL abrir modal/página de adicionar cartão
5. WHEN múltiplos cartões existem THEN SHALL exibir scroll horizontal ou carrossel

**Independent Test**: Carregar dashboard e verificar exibição de cartões + botões de ação funcionais.

---

### P2: Tabela de Recent Transactions

**User Story**: Como usuário, quero ver uma tabela completa de transações recentes com filtros e ordenação para acompanhar meus gastos detalhadamente.

**Why P2**: Importante mas não bloqueia uso básico do dashboard - usuários podem navegar para página dedicada de transações.

**Acceptance Criteria**:

1. WHEN dashboard carrega THEN sistema SHALL exibir tabela "Recent Transaction" abaixo dos gráficos
2. WHEN tabela renderiza THEN SHALL mostrar colunas: Transaction, Date, Amount, Category, Account, Status
3. WHEN usuário clica em header de coluna THEN sistema SHALL ordenar dados pela coluna
4. WHEN usuário digita em "Search transactions" THEN SHALL filtrar resultados em tempo real
5. WHEN usuário clica em "Filter" THEN SHALL abrir modal com opções de filtro avançado
6. WHEN transação tem status "Success" THEN SHALL exibir badge verde

**Independent Test**: Carregar dashboard, buscar transação, aplicar filtro e verificar ordenação funcional.

---

### P2: Gráfico de Linha de Saldo (Mini Chart em My Balance)

**User Story**: Como usuário, quero ver um mini gráfico de linha dentro do card My Balance mostrando a evolução do meu saldo nos últimos dias.

**Why P2**: Adiciona contexto visual valioso mas não é essencial para a primeira versão funcional.

**Acceptance Criteria**:

1. WHEN card My Balance renderiza THEN sistema SHALL exibir gráfico de linha compacto abaixo do valor
2. WHEN gráfico carrega THEN SHALL mostrar últimos 7-30 dias com eixo X (datas) sutilmente marcado
3. WHEN linha tem tendência positiva THEN SHALL usar cor verde/azul
4. WHEN hover sobre ponto THEN SHALL exibir tooltip com data e valor exato
5. WHEN dados estão carregando THEN SHALL exibir skeleton/placeholder

**Independent Test**: Visualizar card Balance e confirmar que gráfico reflete mudanças históricas do saldo.

---

### P3: Animações e Transições

**User Story**: Como usuário, quero transições suaves entre estados e animações sutis ao carregar dados para uma experiência mais polida e profissional.

**Why P3**: Melhora percepção de qualidade mas não afeta funcionalidade core.

**Acceptance Criteria**:

1. WHEN cards carregam THEN sistema SHALL aplicar fade-in com stagger (um após o outro)
2. WHEN hover sobre elementos interativos THEN SHALL ter transição suave de 200-300ms
3. WHEN dados são atualizados THEN valores SHALL animar mudança (count-up para valores)
4. WHEN página muda THEN SHALL ter transição de fade entre rotas
5. WHEN skeleton aparece THEN SHALL ter animação de shimmer

**Independent Test**: Recarregar página e observar se animações são suaves e não causam jank/travamentos.

---

### P3: Tema e Acessibilidade

**User Story**: Como usuário, quero que a interface seja acessível (contraste adequado, navegação por teclado) para uso confortável por longos períodos.

**Why P3**: Importante mas pode ser refinado após lançamento da primeira versão funcional.

**Acceptance Criteria**:

1. WHEN usuário navega por teclado THEN todos elementos interativos SHALL ter focus visible
2. WHEN texto é exibido THEN contraste SHALL ser mínimo WCAG AA (4.5:1)
3. WHEN imagens/ícones aparecem THEN SHALL ter alt text descritivo
4. WHEN ações críticas acontecem THEN SHALL ter feedback visual (loading, success, error)
5. WHEN formulários são usados THEN labels SHALL estar associados a inputs

**Independent Test**: Testar navegação completa apenas com teclado (Tab, Enter, Esc) e validar contraste com ferramenta de acessibilidade.

---

## Technical Constraints

- **Stack atual**: React + TypeScript + TailwindCSS + Tanstack Query
- **Backend**: NestJS com Prisma - não requer mudanças para este redesign
- **Responsividade**: Mobile-first, breakpoints lg: 1024px, md: 768px
- **Browser support**: Últimas 2 versões de Chrome, Firefox, Safari, Edge

## Success Metrics

- Dashboard carrega em <2s com dados mockados
- 0 erros de TypeScript/ESLint
- Todos os componentes responsivos em 3 breakpoints (mobile, tablet, desktop)
- 100% das funcionalidades existentes mantidas
- Score de acessibilidade Lighthouse >90

## Dependencies

- Biblioteca de gráficos: Recharts (já em uso) ou Chart.js
- Ícones: Lucide React (já em uso)
- Formatação de moeda: Intl.NumberFormat (nativo)
- Date formatting: date-fns (já em uso)
