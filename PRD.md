# Product Requirements Document (PRD)
## Aplicação de Gerenciamento de Finanças Pessoais

**Versão:** 1.0  
**Data:** 30 de Maio, 2026  
**Autor:** Alex Bauruel  
**Status:** Draft

---

## 1. Visão Geral do Produto

### 1.1 Contexto e Problema
Atualmente, o processo de gerenciamento de finanças pessoais é realizado manualmente através de uma planilha Excel (setembro22.xlx), resultando em um fluxo de trabalho moroso e propenso a erros:

**Problemas Identificados:**
- ⏱️ **Processo Manual e Demorado**: Entrada manual de dados de extratos bancários e cartões de crédito
- 📅 **Gestão Mensal Repetitiva**: Necessidade de copiar abas mensalmente e limpar dados não recorrentes
- 🔄 **Falta de Automação**: Despesas recorrentes precisam ser atualizadas manualmente
- 📊 **Dificuldade de Acompanhamento**: Consulta reativa aos extratos ao invés de acompanhamento proativo
- 🎯 **Categorização Manual**: Classificação de gastos feita manualmente para cada transação

### 1.2 Proposta de Solução
Desenvolver uma aplicação web/mobile que automatize o processo de registro e gerenciamento de finanças pessoais, com:
- Integração automática com extratos bancários e cartões
- Gerenciamento inteligente de despesas recorrentes
- Categorização automática de transações
- Dashboard de métricas e insights financeiros
- Fluxo simplificado de entrada de dados

### 1.3 Objetivos do Produto
- **Reduzir em 80%** o tempo gasto com entrada manual de dados
- **Automatizar 100%** a criação e gestão de períodos mensais
- **Proporcionar visibilidade em tempo real** da situação financeira
- **Facilitar** a tomada de decisões financeiras através de métricas e insights

---

## 2. Usuários e Personas

### 2.1 Persona Principal: "O Organizador Financeiro"
**Nome:** Alex  
**Idade:** 25-45 anos  
**Perfil:** 
- Pessoa organizada que acompanha suas finanças
- Utiliza múltiplas contas bancárias e cartões de crédito
- Possui despesas recorrentes (assinaturas, contas fixas)
- Valoriza seu tempo e busca eficiência
- Toma decisões baseadas em dados

**Necessidades:**
- Visão consolidada de todas as transações
- Acompanhamento de gastos por categoria
- Gestão de despesas recorrentes
- Alertas de pagamentos próximos
- Relatórios mensais automatizados

**Frustrações Atuais:**
- "Perco muito tempo aos finais de semana revisando extratos"
- "Esqueço de registrar gastos e depois não lembro os detalhes"
- "Todo mês preciso fazer a mesma coisa: copiar, colar, limpar"
- "Não tenho uma visão clara de onde meu dinheiro está indo"

---

## 3. Requisitos Funcionais

### 3.1 RF01 - Gerenciamento de Transações

#### RF01.1 - Registro de Transações
**Prioridade:** P0 (Crítico)

**Descrição:** O usuário deve poder registrar manualmente transações financeiras.

**Critérios de Aceitação:**
- [ ] Campos obrigatórios: Data, Valor, Descrição, Tipo de Pagamento, Categoria
- [ ] Tipos de pagamento suportados: Débito, Crédito, Dinheiro, PIX, Transferência
- [ ] Categorias pré-definidas e personalizáveis
- [ ] Opção de marcar transação como recorrente
- [ ] Validação de campos (data válida, valor numérico)
- [ ] Feedback visual de sucesso/erro

**User Story:**
> "Como usuário, quero registrar rapidamente uma despesa para manter meu controle financeiro atualizado"

#### RF01.2 - Edição e Exclusão de Transações
**Prioridade:** P0 (Crítico)

**Critérios de Aceitação:**
- [ ] Permitir editar qualquer campo de uma transação existente
- [ ] Permitir excluir transações com confirmação
- [ ] Histórico de alterações (audit log)
- [ ] Não permitir edição de transações importadas automaticamente (apenas categorização)

#### RF01.3 - Visualização de Transações
**Prioridade:** P0 (Crítico)

**Critérios de Aceitação:**
- [ ] Listagem de transações em formato de tabela
- [ ] Filtros por: período, categoria, tipo de pagamento, status
- [ ] Ordenação por data, valor, categoria
- [ ] Busca por descrição
- [ ] Indicador visual de status (pago/pendente)
- [ ] Paginação ou scroll infinito

### 3.2 RF02 - Despesas Recorrentes

#### RF02.1 - Cadastro de Despesas Recorrentes
**Prioridade:** P0 (Crítico)

**Descrição:** Sistema para gerenciar despesas que se repetem mensalmente.

**Critérios de Aceitação:**
- [ ] Marcar transação como recorrente durante cadastro
- [ ] Definir frequência (mensal, semanal, anual)
- [ ] Definir data de vencimento
- [ ] Definir se o valor é fixo ou variável
- [ ] Opção de data de início e fim da recorrência
- [ ] Status: Ativo/Inativo

**User Story:**
> "Como usuário, quero cadastrar minhas contas fixas como recorrentes para não precisar digitá-las todo mês"

#### RF02.2 - Geração Automática de Despesas Recorrentes
**Prioridade:** P0 (Crítico)

**Critérios de Aceitação:**
- [ ] Sistema gera automaticamente transações recorrentes no início do mês
- [ ] Transações geradas com status "Pendente"
- [ ] Notificação ao usuário das transações criadas
- [ ] Possibilidade de ajustar valor antes de marcar como pago
- [ ] Manter histórico de todas as ocorrências

#### RF02.3 - Gestão de Status de Pagamento
**Prioridade:** P0 (Crítico)

**Critérios de Aceitação:**
- [ ] Marcar despesa como "Paga" com um clique
- [ ] Registrar data efetiva de pagamento
- [ ] Atualizar valor se diferente do esperado
- [ ] Indicador visual claro de status

### 3.3 RF03 - Gestão de Períodos Mensais

#### RF03.1 - Criação Automática de Períodos
**Prioridade:** P0 (Crítico)

**Descrição:** Sistema cria automaticamente novos períodos mensais sem intervenção manual.

**Critérios de Aceitação:**
- [ ] Criação automática do período no primeiro dia do mês
- [ ] Cópia automática de despesas recorrentes do mês anterior
- [ ] Limpeza automática de transações não recorrentes
- [ ] Manutenção de categorias e configurações
- [ ] Notificação ao usuário sobre criação do novo período

**User Story:**
> "Como usuário, quero que o sistema prepare automaticamente o mês seguinte para não precisar copiar e limpar dados manualmente"

#### RF03.2 - Navegação entre Períodos
**Prioridade:** P1 (Alta)

**Critérios de Aceitação:**
- [ ] Selector de mês/ano
- [ ] Botões de navegação anterior/próximo
- [ ] Visualização do período atual destacada
- [ ] Acesso rápido aos últimos 12 meses
- [ ] Visualização de períodos futuros (planejamento)

### 3.4 RF04 - Categorização

#### RF04.1 - Categorias Predefinidas
**Prioridade:** P1 (Alta)

**Categorias Sugeridas:**
- 🏠 Moradia (Aluguel, Condomínio, IPTU)
- ⚡ Contas (Luz, Água, Gás, Internet, Telefone)
- 🍔 Alimentação (Mercado, Restaurantes, Delivery)
- 🚗 Transporte (Combustível, Uber, Transporte Público)
- 🏥 Saúde (Plano de Saúde, Farmácia, Consultas)
- 🎓 Educação (Cursos, Livros, Material)
- 🎮 Lazer (Streaming, Cinema, Hobbies)
- 👕 Vestuário
- 💰 Investimentos
- 🎁 Outros

#### RF04.2 - Categorias Personalizadas
**Prioridade:** P1 (Alta)

**Critérios de Aceitação:**
- [ ] Criar novas categorias
- [ ] Editar categorias existentes
- [ ] Definir ícones/cores para categorias
- [ ] Subcategorias (opcional)
- [ ] Não permitir excluir categorias em uso

#### RF04.3 - Sugestão Automática de Categoria
**Prioridade:** P2 (Média)

**Critérios de Aceitação:**
- [ ] Sistema aprende com categorizações anteriores
- [ ] Sugestão baseada em descrição similar
- [ ] Usuário pode aceitar ou recusar sugestão
- [ ] Melhoria contínua do algoritmo

### 3.5 RF05 - Importação de Dados

#### RF05.1 - Importação de Extrato Bancário
**Prioridade:** P1 (Alta)

**Descrição:** Importar transações de arquivos de extrato bancário.

**Critérios de Aceitação:**
- [ ] Suporte a formatos: CSV, OFX, PDF
- [ ] Mapeamento de colunas flexível
- [ ] Detecção de duplicatas
- [ ] Preview antes de confirmar importação
- [ ] Sugestão de categorização
- [ ] Associação automática com conta bancária

**User Story:**
> "Como usuário, quero importar meu extrato bancário para não precisar digitar cada transação manualmente"

#### RF05.2 - Integração com Open Finance
**Prioridade:** P3 (Baixa - Future)

**Descrição:** Integração futura com Open Finance para sincronização automática.

**Critérios de Aceitação:**
- [ ] Conexão segura com instituições financeiras
- [ ] Sincronização automática de transações
- [ ] Atualização de saldos em tempo real
- [ ] Conformidade com LGPD
- [ ] Gestão de consentimentos

### 3.6 RF06 - Dashboard e Métricas

#### RF06.1 - Dashboard Principal
**Prioridade:** P1 (Alta)

**Componentes:**
- [ ] Saldo atual consolidado
- [ ] Gastos do mês atual vs. mês anterior
- [ ] Gastos por categoria (gráfico de pizza/barras)
- [ ] Timeline de transações recentes
- [ ] Despesas pendentes
- [ ] Alertas e notificações

**User Story:**
> "Como usuário, quero ver imediatamente minha situação financeira ao abrir o app"

#### RF06.2 - Relatórios Mensais
**Prioridade:** P1 (Alta)

**Critérios de Aceitação:**
- [ ] Total de receitas vs. despesas
- [ ] Gastos por categoria (valores e percentuais)
- [ ] Comparação com meses anteriores
- [ ] Média de gastos por categoria
- [ ] Identificação de gastos atípicos
- [ ] Exportação em PDF

#### RF06.3 - Análises e Insights
**Prioridade:** P2 (Média)

**Critérios de Aceitação:**
- [ ] Tendências de gastos (aumentando/diminuindo)
- [ ] Alertas de gastos acima da média
- [ ] Sugestões de economia
- [ ] Projeção de gastos futuros
- [ ] Análise de despesas recorrentes

### 3.7 RF07 - Alertas e Notificações

#### RF07.1 - Alertas de Vencimento
**Prioridade:** P1 (Alta)

**Critérios de Aceitação:**
- [ ] Notificação 3 dias antes do vencimento
- [ ] Notificação no dia do vencimento
- [ ] Lista de contas a vencer na semana
- [ ] Configuração de preferências de alertas

#### RF07.2 - Alertas de Orçamento
**Prioridade:** P2 (Média)

**Critérios de Aceitação:**
- [ ] Definir limite de gastos por categoria
- [ ] Alerta ao atingir 80% do limite
- [ ] Alerta ao ultrapassar limite
- [ ] Visualização de progresso do orçamento

### 3.8 RF08 - Gestão de Contas e Cartões

#### RF08.1 - Cadastro de Contas
**Prioridade:** P1 (Alta)

**Critérios de Aceitação:**
- [ ] Cadastrar múltiplas contas bancárias
- [ ] Cadastrar múltiplos cartões de crédito
- [ ] Definir apelido para cada conta/cartão
- [ ] Registrar saldo inicial
- [ ] Status ativo/inativo
- [ ] Cores/ícones para identificação rápida

#### RF08.2 - Conciliação de Saldos
**Prioridade:** P2 (Média)

**Critérios de Aceitação:**
- [ ] Saldo calculado vs. saldo real
- [ ] Identificação de discrepâncias
- [ ] Ajuste de saldo com justificativa
- [ ] Histórico de conciliações

---

## 4. Requisitos Não Funcionais

### 4.1 RNF01 - Performance
- **RNF01.1:** Carregamento da página inicial em menos de 2 segundos
- **RNF01.2:** Operações CRUD em menos de 500ms
- **RNF01.3:** Suporte a pelo menos 10.000 transações por usuário sem degradação

### 4.2 RNF02 - Segurança
- **RNF02.1:** Autenticação obrigatória (email/senha)
- **RNF02.2:** Criptografia de dados sensíveis em repouso
- **RNF02.3:** Comunicação via HTTPS obrigatório
- **RNF02.4:** Conformidade com LGPD
- **RNF02.5:** Logout automático após 30 minutos de inatividade
- **RNF02.6:** Auditoria de acessos e alterações

### 4.3 RNF03 - Usabilidade
- **RNF03.1:** Interface responsiva (desktop, tablet, mobile)
- **RNF03.2:** Design intuitivo com curva de aprendizado mínima
- **RNF03.3:** Suporte a modo escuro
- **RNF03.4:** Feedback visual para todas as ações
- **RNF03.5:** Máximo de 3 cliques para qualquer operação principal

### 4.4 RNF04 - Confiabilidade
- **RNF04.1:** Disponibilidade de 99.5%
- **RNF04.2:** Backup automático diário
- **RNF04.3:** Recuperação de desastres em até 24 horas
- **RNF04.4:** Validação de dados em todas as entradas

### 4.5 RNF05 - Portabilidade
- **RNF05.1:** Exportação de dados em CSV/JSON
- **RNF05.2:** Importação de dados do Excel existente
- **RNF05.3:** API para integrações futuras

### 4.6 RNF06 - Escalabilidade
- **RNF06.1:** Arquitetura preparada para crescimento
- **RNF06.2:** Suporte a múltiplos usuários simultaneamente
- **RNF06.3:** Cache de dados frequentemente acessados

---

## 5. Arquitetura Técnica Proposta

### 5.1 Stack Tecnológica (Sugestão)

**Frontend:**
- React.js / Next.js (Web)
- React Native (Mobile - fase 2)
- TailwindCSS / Material-UI
- Chart.js / Recharts (gráficos)

**Backend:**
- Node.js + Express / NestJS
- TypeScript
- PostgreSQL (banco de dados principal)
- Redis (cache)

**Infraestrutura:**
- Docker
- CI/CD (GitHub Actions)
- Cloud: AWS / Azure / Vercel

**Integrações:**
- Open Finance API (fase futura)
- Serviços de notificação (email, push)

### 5.2 Modelo de Dados (Entidades Principais)

```typescript
// User
{
  id: string
  email: string
  name: string
  createdAt: Date
  settings: UserSettings
}

// Account (Conta Bancária/Cartão)
{
  id: string
  userId: string
  name: string
  type: 'checking' | 'savings' | 'credit_card'
  initialBalance: number
  currentBalance: number
  active: boolean
}

// Category
{
  id: string
  userId: string
  name: string
  icon: string
  color: string
  parentId?: string
}

// Transaction
{
  id: string
  userId: string
  accountId: string
  categoryId: string
  date: Date
  amount: number
  description: string
  paymentType: 'debit' | 'credit' | 'cash' | 'pix' | 'transfer'
  status: 'pending' | 'paid' | 'cancelled'
  isRecurring: boolean
  recurringId?: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// RecurringTransaction
{
  id: string
  userId: string
  categoryId: string
  accountId: string
  description: string
  amount: number
  frequency: 'weekly' | 'monthly' | 'yearly'
  dayOfMonth: number
  startDate: Date
  endDate?: Date
  active: boolean
  lastGenerated: Date
}
```

---

## 6. Fluxos de Usuário

### 6.1 Fluxo Principal: Registro de Despesa

```
1. Usuário acessa dashboard
2. Clica em "+ Nova Transação"
3. Preenche formulário:
   - Data (padrão: hoje)
   - Valor
   - Descrição
   - Categoria (sugestão automática)
   - Conta
   - Tipo de pagamento
   - [Opcional] Marcar como recorrente
4. Clica em "Salvar"
5. Sistema valida dados
6. Transação é criada
7. Dashboard é atualizado
8. Feedback de sucesso
```

### 6.2 Fluxo: Gestão de Despesas Recorrentes

```
1. Usuário acessa "Despesas Recorrentes"
2. Visualiza lista de recorrentes ativas
3. Sistema mostra status de cada uma no mês atual:
   - ✅ Paga
   - ⏳ Pendente
   - ⚠️ Atrasada
4. Para marcar como paga:
   - Clica no checkbox
   - [Opcional] Ajusta valor
   - Confirma
5. Status é atualizado
```

### 6.3 Fluxo: Início de Novo Mês

```
Automático (1º dia do mês às 00:00):
1. Sistema cria novo período mensal
2. Copia despesas recorrentes ativas
3. Define status como "Pendente"
4. Envia notificação ao usuário
5. Usuário abre app e vê novo mês preparado
```

### 6.4 Fluxo: Importação de Extrato

```
1. Usuário acessa "Importar Extrato"
2. Seleciona conta de destino
3. Faz upload do arquivo (CSV/OFX/PDF)
4. Sistema processa e exibe preview
5. Usuário revisa e categoriza transações
6. Sistema detecta duplicatas
7. Usuário confirma importação
8. Transações são criadas
9. Dashboard atualizado
```

---

## 7. Critérios de Sucesso e Métricas

### 7.1 Métricas de Sucesso

**Adoção:**
- Taxa de retenção após 30 dias > 70%
- Usuários ativos diários (DAU) / Usuários ativos mensais (MAU) > 40%

**Engagement:**
- Média de transações registradas por usuário/mês > 30
- Tempo médio de sessão > 5 minutos
- Número de acessos por semana > 3

**Eficiência:**
- Redução de 80% no tempo de registro vs. Excel
- 90% das despesas recorrentes automatizadas
- Taxa de categorização automática > 60%

**Satisfação:**
- Net Promoter Score (NPS) > 50
- Rating na loja de apps > 4.5 estrelas
- Taxa de abandono do cadastro < 20%

### 7.2 KPIs Técnicos

- Uptime > 99.5%
- Tempo de resposta P95 < 1 segundo
- Taxa de erros < 0.1%
- Tempo de carregamento inicial < 2 segundos

---

## 8. Roadmap e Fases de Desenvolvimento

### 8.1 Fase 1 - MVP (2-3 meses)
**Objetivo:** Substituir completamente o Excel com funcionalidades básicas

**Funcionalidades:**
- ✅ Autenticação de usuário
- ✅ CRUD de transações
- ✅ Categorização básica
- ✅ Despesas recorrentes
- ✅ Dashboard simples
- ✅ Filtros e busca
- ✅ Gestão automática de períodos mensais
- ✅ Relatório mensal básico

**Critério de Sucesso MVP:**
- Usuário consegue gerenciar suas finanças sem usar o Excel
- Tempo de entrada de dados reduzido em 50%

### 8.2 Fase 2 - Melhorias e Automação (1-2 meses)
**Funcionalidades:**
- 📊 Dashboard avançado com gráficos
- 📥 Importação de extratos (CSV/OFX)
- 🔔 Sistema de alertas e notificações
- 🏦 Gestão de múltiplas contas
- 🎯 Orçamentos por categoria
- 📱 App mobile (React Native)
- 🤖 Sugestão inteligente de categorias

### 8.3 Fase 3 - Inteligência e Insights (1-2 meses)
**Funcionalidades:**
- 📈 Análises e tendências
- 🎯 Projeções e previsões
- 💡 Sugestões de economia
- 🔄 Integração Open Finance
- 📊 Relatórios avançados
- 🌙 Modo escuro
- 🔗 API pública

### 8.4 Fase 4 - Features Premium (Future)
**Funcionalidades:**
- 👥 Compartilhamento (finanças familiares)
- 💰 Gestão de investimentos
- 🎯 Objetivos financeiros
- 📊 Análise comparativa com benchmarks
- 🤖 Assistente virtual IA
- 📲 Integração com WhatsApp

---

## 9. Riscos e Mitigações

### 9.1 Riscos Técnicos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Complexidade de integração Open Finance | Alta | Alto | Começar com importação manual, integração em fase posterior |
| Performance com grande volume de dados | Média | Alto | Arquitetura escalável, indexação adequada, cache |
| Segurança de dados sensíveis | Baixa | Crítico | Criptografia, auditorias, conformidade LGPD |

### 9.2 Riscos de Produto

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Usuário não adotar (preferir Excel) | Média | Alto | Importação do Excel existente, onboarding guiado |
| Curva de aprendizado alta | Média | Médio | Interface intuitiva, tutoriais, templates |
| Categorização automática imprecisa | Alta | Médio | Machine learning iterativo, feedback do usuário |

### 9.3 Riscos de Negócio

| Risco | Probabilidade | Impacto | Mitigação |
|-------|--------------|---------|-----------|
| Competição com apps existentes | Alta | Médio | Foco em diferenciais (automação, simplicidade) |
| Custos de infraestrutura | Média | Médio | Arquitetura serverless, otimização de recursos |

---

## 10. Diferenciais Competitivos

### 10.1 O que nos torna únicos?

1. **🎯 Foco em Automação Total**
   - Gestão automática de meses e recorrências
   - Zero trabalho manual de cópia e limpeza

2. **⚡ Velocidade de Entrada**
   - Interface otimizada para registro rápido
   - Sugestões inteligentes baseadas em histórico

3. **🔄 Migração Fácil do Excel**
   - Importação direta do Excel existente
   - Manutenção da estrutura familiar

4. **📊 Insights Acionáveis**
   - Não apenas mostrar dados, mas sugerir ações
   - Alertas proativos e recomendações

5. **🛡️ Privacidade First**
   - Dados criptografados
   - Sem venda de informações
   - Conformidade total com LGPD

---

## 11. Anexos

### 11.1 Wireframes e Mockups
(A ser desenvolvido)

### 11.2 Benchmarking de Concorrentes

**Concorrentes Identificados:**
- Organizze
- Mobills
- GuiaBolso (descontinuado)
- Wallet
- Money Lover

**Gaps de Mercado:**
- Maioria não tem gestão automática robusta de recorrências
- Processo de categorização ainda manual
- Pouca automação na gestão mensal

### 11.3 Glossário

- **Transação**: Qualquer movimentação financeira (receita ou despesa)
- **Recorrente**: Despesa/receita que se repete periodicamente
- **Categoria**: Classificação de transação para agrupamento
- **Período**: Ciclo mensal de controle financeiro
- **Conciliação**: Processo de validação do saldo calculado vs. real

---

## 12. Aprovações

| Papel | Nome | Data | Assinatura |
|-------|------|------|-----------|
| Product Owner | [Nome] | [Data] | |
| Tech Lead | [Nome] | [Data] | |
| UX Lead | [Nome] | [Data] | |

---

## 13. Histórico de Versões

| Versão | Data | Autor | Alterações |
|--------|------|-------|-----------|
| 1.0 | 30/05/2026 | Alex Bauruel | Criação inicial do PRD |

---

## 14. Próximos Passos

1. ✅ **Aprovação do PRD** pelos stakeholders
2. 📐 **Design de UX/UI** - Wireframes e protótipos
3. 🏗️ **Arquitetura Técnica Detalhada** - Decisões técnicas finais
4. 📋 **Criação de Backlog** - User stories e tasks
5. 🚀 **Sprint Planning** - Início do desenvolvimento do MVP
6. 🧪 **Setup de Ambiente** - Repositório, CI/CD, infraestrutura
7. 👥 **Recrutamento de Beta Testers** - Usuários para validação

---

**Contato:**  
Para dúvidas ou sugestões sobre este PRD, entre em contato com Alex Bauruel.
