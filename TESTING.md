# Guia de Teste - Personal Finance

## ✅ Status Atual

### Backend (100% Implementado)
- ✅ Autenticação JWT completa
- ✅ CRUD de Contas (Accounts)
- ✅ 9 endpoints REST implementados
- ✅ Validação com class-validator
- ✅ Guards e estratégias Passport
- ✅ CORS configurado
- ✅ Database PostgreSQL com Prisma

### Frontend (100% Implementado)
- ✅ Formulários de login e registro
- ✅ CRUD completo de contas bancárias
- ✅ Validação com React Hook Form + Zod
- ✅ Integração com authStore (Zustand)
- ✅ Feedback visual com toasts (Sonner)
- ✅ Interceptors para refresh token
- ✅ Rotas protegidas

---

## 🚀 Como Testar o Sistema

### 1. Iniciar o Backend

```bash
# Terminal 1 - Backend
cd backend
npm run start:dev
```

**Esperado**: Servidor rodando em `http://localhost:3000/api/v1`

Se houver problemas com o npm script, tente:
```bash
# Alternativa: compilar e rodar com node
npm run build
node dist/main.js
```

### 2. Iniciar o Frontend

```bash
# Terminal 2 - Frontend
cd frontend
npm run dev
```

**Esperado**: Aplicação rodando em `http://localhost:5173`

### 3. Verificar Database

```bash
# Terminal 3 - Verificar se o PostgreSQL está rodando
podman ps

# Se não estiver rodando:
cd /Users/alexbauruel/www/sideprojects/personal-finance
podman compose up -d
```

**Esperado**: Container `personal-finance-db` rodando na porta 5432

---

## 🧪 Cenários de Teste

### Teste 1: Criar Nova Conta

1. Abra o navegador em `http://localhost:5173`
2. Clique em "Cadastre-se"
3. Preencha o formulário:
   - **Nome**: Seu Nome
   - **Email**: teste@example.com
   - **Senha**: 123456
   - **Confirmar Senha**: 123456
4. Clique em "Criar conta"

**Resultado Esperado**:
- ✅ Toast de sucesso aparece
- ✅ Redirecionamento para `/dashboard`
- ✅ Token armazenado no localStorage
- ✅ Navbar mostra informações do usuário

### Teste 2: Login com Conta Existente

**Credenciais pré-carregadas no seed**:
- **Email**: test@example.com
- **Senha**: password123

1. Acesse `http://localhost:5173/login`
2. Preencha o formulário com as credenciais acima
3. Clique em "Entrar"

**Resultado Esperado**:
- ✅ Toast de sucesso
- ✅ Redirecionamento para `/dashboard`
- ✅ Token armazenado

### Teste 3: Validação de Formulários

**Testar validações no Register**:
1. Tente criar conta com email inválido → Erro exibido
2. Tente senha com menos de 6 caracteres → Erro exibido
3. Tente senhas diferentes → "As senhas não coincidem"

**Testar validações no Login**:
1. Tente email inválido → Erro exibido
2. Tente credenciais incorretas → Toast de erro

### Teste 4: Rotas Protegidas

1. Abra o navegador em modo anônimo
2. Tente acessar `http://localhost:5173/dashboard`

**Resultado Esperado**:
- ✅ Redirecionamento automático para `/login`

### Teste 5: Logout

1. Faça login na aplicação
2. Clique no botão de logout na Navbar
3. Tente acessar `/dashboard` novamente

**Resultado Esperado**:
- ✅ Token removido do localStorage
- ✅ Redirecionamento para `/login`

### Teste 6: CRUD de Contas

#### 6.1 Criar Nova Conta

1. Faça login na aplicação
2. Acesse `/accounts` ou clique em "Contas" no menu
3. Clique no botão "Nova Conta"
4. Preencha o formulário:
   - **Nome**: Nubank
   - **Tipo**: Conta Corrente
   - **Saldo Inicial**: 1000.00
5. Clique em "Criar"

**Resultado Esperado**:
- ✅ Toast de sucesso aparece
- ✅ Nova conta aparece na lista
- ✅ Card mostra ícone correto (Wallet)
- ✅ Saldo exibido: R$ 1.000,00

#### 6.2 Editar Conta

1. Na lista de contas, clique no ícone de editar (lápis)
2. Altere o nome para "Nubank Conta Principal"
3. Altere o saldo inicial para 1500.00
4. Clique em "Atualizar"

**Resultado Esperado**:
- ✅ Toast de sucesso
- ✅ Nome e saldo atualizados no card

#### 6.3 Criar Diferentes Tipos de Conta

Crie mais 2 contas para testar os ícones:
- **Poupança**: Nome: "Poupança Caixa", Tipo: Conta Poupança, Saldo: 500
- **Cartão**: Nome: "Visa Itaú", Tipo: Cartão de Crédito, Saldo: 0

**Resultado Esperado**:
- ✅ Conta Poupança mostra ícone de porquinho (PiggyBank)
- ✅ Cartão de Crédito mostra ícone de cartão (CreditCard)

#### 6.4 Deletar Conta

1. Clique no ícone de lixeira em uma conta
2. Confirme a exclusão no dialog

**Resultado Esperado**:
- ✅ Toast de sucesso
- ✅ Conta removida da lista

---

## 🔍 Teste com cURL (Backend Direto)

### Registrar usuário
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste User",
    "email": "teste@example.com",
    "password": "123456"
  }'
```

**Resposta esperada**: JSON com `user`, `accessToken`, `refreshToken`

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### Acessar perfil (com token)
```bash
# Substitua YOUR_ACCESS_TOKEN pelo token recebido no login
curl -X GET http://localhost:3000/api/v1/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Refresh Token
```bash
curl -X POST http://localhost:3000/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{
    "refreshToken": "YOUR_REFRESH_TOKEN"
  }'
```

### Listar Contas
```bash
curl -X GET http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Criar Conta
```bash
curl -X POST http://localhost:3000/api/v1/accounts \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nubank",
    "type": "CHECKING",
    "initialBalance": 1000
  }'
```

### Atualizar Conta
```bash
# Substitua ACCOUNT_ID pelo ID da conta
curl -X PATCH http://localhost:3000/api/v1/accounts/ACCOUNT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nubank Conta Principal"
  }'
```

### Deletar Conta
```bash
curl -X DELETE http://localhost:3000/api/v1/accounts/ACCOUNT_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🐛 Troubleshooting

### Backend não inicia

**Problema**: `npm run start:dev` falha

**Solução**:
```bash
# Verifique se as dependências estão instaladas
npm install

# Tente compilar manualmente
npm run build

# Execute o arquivo compilado
node dist/main.js
```

### Database connection error

**Problema**: `Can't reach database server at localhost:5432`

**Solução**:
```bash
# Verifique se o container está rodando
podman ps

# Se não estiver, inicie:
podman compose up -d

# Verifique os logs:
podman logs personal-finance-db

# Teste a conexão:
podman exec -it personal-finance-db psql -U postgres -d personal_finance
```

### Frontend não carrega

**Problema**: Página em branco ou erro de CORS

**Solução**:
1. Verifique se o backend está rodando em `http://localhost:3000`
2. Verifique o arquivo `.env` do backend:
   ```
   FRONTEND_URL=http://localhost:5173
   ```
3. Reinicie ambos os servidores

### Erros de validação inesperados

**Problema**: Formulários rejeitam dados válidos

**Solução**:
1. Verifique no console do navegador (F12)
2. Verifique os logs do backend no terminal
3. Confirme que os DTOs do backend correspondem aos schemas do Zod

---

## 📊 Estrutura dos Dados

### Usuário (User)
```typescript
{
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
```

### Resposta de Autenticação
```typescript
{
  user: User;
  accessToken: string;  // JWT válido por 15 minutos
  refreshToken: string; // JWT válido por 7 dias
}
```

---

## 🎯 Próximos Passos

Módulos já implementados:
- ✅ **Autenticação** (M1.1) - Login, registro, JWT, guards
- ✅ **CRUD de Contas** (M1.2) - Criar, listar, editar, deletar contas

Próximos módulos a implementar:

1. **CRUD de Categorias** (M1.3)
   - Listar categorias (10 pré-carregadas no seed)
   - Editar categorias existentes
   - Criar novas categorias personalizadas
   - Tempo estimado: ~1.5h

2. **CRUD de Transações** (M1.4)
   - Listar transações com paginação
   - Criar transação vinculada a conta e categoria
   - Editar/deletar transação
   - Filtros por data, categoria, conta, tipo
   - Tempo estimado: ~3h

3. **Dashboard** (M1.5)
   - Cards de resumo (saldo total, receitas, despesas)
   - Gráfico de gastos por categoria (Recharts)
   - Gráfico de tendência mensal
   - Lista de transações recentes
   - Tempo estimado: ~2h

---

## 📝 Notas

- **JWT_SECRET** e **JWT_REFRESH_SECRET** devem ser mantidos seguros
- Em produção, use variáveis de ambiente seguras
- O refresh token deve ser rotacionado após uso (já implementado)
- Todas as rotas `/api/v1/*` são protegidas exceto `/auth/register`, `/auth/login`, `/auth/refresh`

---

**Última atualização**: 30/05/2026
**Status**: 
- ✅ M1.1 Autenticação - 100% Completo
- ✅ M1.2 CRUD de Contas - 100% Completo
