# Personal Finance Manager - Project Definition

**Project Name:** Personal Finance Manager  
**Type:** MVP - Minimum Viable Product  
**Start Date:** May 30, 2026  
**Status:** 🟢 Active

---

## Vision

Criar uma aplicação web moderna que **automatize completamente** o gerenciamento de finanças pessoais, eliminando o trabalho manual tedioso de planilhas Excel e proporcionando insights financeiros em tempo real.

## Problem Statement

Usuários que gerenciam suas finanças em Excel enfrentam:
- ⏱️ Processo manual e demorado de entrada de dados
- 📅 Trabalho repetitivo mensal de copiar abas e limpar dados
- 🔄 Gestão manual de despesas recorrentes
- 📊 Falta de visibilidade e insights em tempo real
- 🎯 Categorização manual de cada transação

**Impacto:** Aproximadamente 2-3 horas por semana gastas em tarefas administrativas.

## Solution

Aplicação web que oferece:
- ✅ **Automação Total:** Zero trabalho manual de gestão mensal
- ✅ **Despesas Recorrentes:** Sistema inteligente que gera automaticamente transações mensais
- ✅ **Importação de Extratos:** Upload de arquivos CSV/OFX para importação rápida
- ✅ **Dashboard em Tempo Real:** Visão consolidada da situação financeira
- ✅ **Categorização Inteligente:** Sugestões baseadas em histórico

## Goals & Success Metrics

### Primary Goals
1. **Reduzir em 80%** o tempo gasto com entrada de dados financeiros
2. **Automatizar 100%** a criação e gestão de períodos mensais
3. **Proporcionar visibilidade em tempo real** da situação financeira

### Success Metrics
- ✅ Usuário consegue registrar uma transação em **< 30 segundos**
- ✅ Sistema cria novo período mensal **sem intervenção manual**
- ✅ Dashboard carrega em **< 2 segundos**
- ✅ Taxa de retenção após 30 dias **> 70%**
- ✅ NPS (Net Promoter Score) **> 50**

## Scope - MVP

### IN SCOPE ✅
- Autenticação de usuário (email/senha)
- CRUD completo de transações
- Sistema de despesas recorrentes
- Criação automática de períodos mensais
- Categorização com 10 categorias predefinidas
- Dashboard básico com:
  - Saldo atual
  - Gastos do mês
  - Gastos por categoria
  - Lista de transações
- Filtros e busca de transações
- Gestão de múltiplas contas (bancárias/cartões)
- Relatório mensal simples
- Alertas básicos de vencimento

### OUT OF SCOPE ❌ (Future Phases)
- App mobile nativo
- Importação automática de extratos (Open Finance)
- IA/ML para categorização automática
- Análises e previsões avançadas
- Orçamentos por categoria
- Compartilhamento/finanças familiares
- Gestão de investimentos
- Integrações com terceiros
- API pública

## Stakeholders

| Role | Name | Responsibility |
|------|------|----------------|
| Product Owner | Alex Bauruel | Vision, priorities, acceptance |
| Tech Lead | Alex Bauruel | Architecture, tech decisions |
| Developer | Alex Bauruel | Implementation |
| Designer | Alex Bauruel | UX/UI |
| User/Tester | Alex Bauruel | Feedback, validation |

## Constraints

### Technical
- **Budget:** Personal project - minimize cloud costs
- **Timeline:** MVP em 2-3 meses (part-time)
- **Team:** Solo developer
- **Stack:** Preferência por tecnologias conhecidas para velocidade

### Business
- **Compliance:** LGPD-compliant desde o início
- **Security:** Criptografia de dados sensíveis obrigatória
- **Privacy:** Dados não podem ser vendidos ou compartilhados

### User
- **Learning Curve:** Máximo 15 minutos para primeiro uso
- **Performance:** Resposta < 500ms para operações principais
- **Availability:** Uptime > 99% (target)

## Non-Goals

Explicitamente **NÃO** faremos no MVP:
- Sistema de orçamentos complexos
- Análise preditiva com IA
- Gamificação
- Integração com bancos (Open Finance)
- Multi-tenancy/white-label
- Recursos sociais/compartilhamento

## Dependencies

### External
- ✅ Node.js 24.x (já configurado)
- ⏳ Banco de dados (PostgreSQL - a configurar)
- ⏳ Serviço de autenticação (a decidir: próprio ou terceiro)
- ⏳ Hospedagem (a decidir: Vercel, Railway, ou similar)

### Internal
- ⏳ Definição de stack técnica completa
- ⏳ Setup de repositório e CI/CD
- ⏳ Design system básico

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Escopo cresce além do MVP | Alto | Média | Roadmap rígido, priorização constante |
| Usuário não adota (prefere Excel) | Alto | Média | Importação de Excel existente, UX simples |
| Performance com muitos dados | Médio | Baixa | Paginação, indexação adequada |
| Segurança comprometida | Crítico | Baixa | Code review, libs confiáveis, criptografia |
| Timeline ultrapassa 3 meses | Médio | Alta | Corte de features, foco no core |

## Assumptions

1. Usuário está disposto a migrar do Excel
2. Entrada manual de transações é aceitável no MVP (sem integração bancária)
3. 10 categorias predefinidas são suficientes inicialmente
4. Desktop/web é suficiente (mobile pode esperar)
5. Hospedagem gratuita ou de baixo custo é viável

## Key Decisions Log

*Decisions will be tracked in STATE.md as they are made*

## Communication

### Status Updates
- Weekly progress review (self-review)
- Milestone completions documented in STATE.md

### Documentation
- Code: Inline comments + README
- Architecture: Design docs in .specs/features/
- API: OpenAPI spec (se aplicável)

---

**Last Updated:** May 30, 2026  
**Next Review:** End of Sprint 1
