import type { Locale } from '../types/settings.types';

type TransactionMessages = {
  pageTitle: string;
  pageSubtitle: string;
  importCsv: string;
  importFile: string;
  filters: string;
  newTransaction: string;
  totalTransactions: string;
  income: string;
  expenses: string;
  confirmDelete: string;
  createSuccess: string;
  createError: string;
  updateSuccess: string;
  updateError: string;
  deleteSuccess: string;
  deleteError: string;
  importSuccess: string;
  importError: string;
  table: {
    loading: string;
    empty: string;
    emptyHint: string;
    date: string;
    description: string;
    category: string;
    account: string;
    type: string;
    amount: string;
    status: string;
    actions: string;
    edit: string;
    delete: string;
    showing: (from: number, to: number, total: number) => string;
    previous: string;
    next: string;
  };
  filtersPanel: {
    searchPlaceholder: string;
    startDate: string;
    endDate: string;
    category: string;
    allCategories: string;
    account: string;
    allAccounts: string;
    paymentType: string;
    status: string;
    all: string;
    noActiveFilters: string;
    activeFilters: (count: number) => string;
    clearFilters: string;
  };
  form: {
    editTitle: string;
    createTitle: string;
    account: string;
    accountPlaceholder: string;
    category: string;
    categoryPlaceholder: string;
    date: string;
    amount: string;
    description: string;
    descriptionPlaceholder: string;
    paymentType: string;
    status: string;
    notes: string;
    notesPlaceholder: string;
    save: string;
    saving: string;
    cancel: string;
    validation: {
      accountRequired: string;
      categoryRequired: string;
      dateRequired: string;
      amountMin: string;
      descriptionRequired: string;
    };
  };
  csv: {
    title: string;
    supportedFormats: string;
    destinationAccount: string;
    destinationAccountPlaceholder: string;
    defaultCategory: string;
    defaultCategoryPlaceholder: string;
    selectFile: string;
    expectedColumns: string;
    read: string;
    valid: string;
    duplicates: string;
    importDuplicates: string;
    duplicate: string;
    ok: string;
    cancel: string;
    importing: string;
    import: string;
    selectDestinationAccount: string;
    selectDefaultCategory: string;
    columns: {
      row: string;
      date: string;
      description: string;
      amount: string;
      status: string;
    };
  };
};

type AccountMessages = {
  pageTitle: string;
  pageSubtitle: string;
  newAccount: string;
  updateSuccess: string;
  createSuccess: string;
  updateError: string;
  createError: string;
  confirmDelete: string;
  deleteSuccess: string;
  deleteError: string;
  totalBalance: string;
  sinceStart: string;
  totalAccounts: string;
  activeAccounts: string;
  averageBalance: string;
  perAccount: string;
  balanceChangeFromStart: (amount: string) => string;
  list: {
    emptyTitle: string;
    emptyHint: string;
    currentBalance: string;
    initialBalance: string;
    edit: string;
    delete: string;
  };
  modal: {
    editTitle: string;
    createTitle: string;
    accountName: string;
    accountNamePlaceholder: string;
    accountType: string;
    initialBalance: string;
    initialBalancePlaceholder: string;
    editHint: string;
    createHint: string;
    cancel: string;
    saving: string;
    update: string;
    create: string;
    validation: {
      nameRequired: string;
    };
  };
};

type NavbarMessages = {
  greeting: (firstName: string) => string;
  subtitle: string;
  searchPlaceholder: string;
};

const transactionMessagesPt: TransactionMessages = {
  pageTitle: 'Transações',
  pageSubtitle: 'Gerencie todas as suas transações financeiras',
  importCsv: 'Importar CSV',
  importFile: 'Importar Arquivo',
  filters: 'Filtros',
  newTransaction: 'Nova Transação',
  totalTransactions: 'Total de Transações',
  income: 'Receitas',
  expenses: 'Despesas',
  confirmDelete: 'Deseja realmente excluir esta transação?',
  createSuccess: 'Transação criada com sucesso!',
  createError: 'Erro ao criar transação',
  updateSuccess: 'Transação atualizada com sucesso!',
  updateError: 'Erro ao atualizar transação',
  deleteSuccess: 'Transação excluída com sucesso!',
  deleteError: 'Erro ao excluir transação',
  importSuccess: 'Importação concluída com sucesso!',
  importError: 'Erro ao importar arquivo',
  table: {
    loading: 'Carregando transações...',
    empty: 'Nenhuma transação encontrada',
    emptyHint: 'Tente ajustar os filtros ou criar uma nova transação',
    date: 'Data',
    description: 'Descrição',
    category: 'Categoria',
    account: 'Conta',
    type: 'Tipo',
    amount: 'Valor',
    status: 'Status',
    actions: 'Ações',
    edit: 'Editar',
    delete: 'Excluir',
    showing: (from, to, total) => `Mostrando ${from} até ${to} de ${total} transações`,
    previous: 'Anterior',
    next: 'Próxima',
  },
  filtersPanel: {
    searchPlaceholder: 'Buscar por descrição...',
    startDate: 'Data Início',
    endDate: 'Data Fim',
    category: 'Categoria',
    allCategories: 'Todas',
    account: 'Conta',
    allAccounts: 'Todas',
    paymentType: 'Tipo de Pagamento',
    status: 'Status',
    all: 'Todos',
    noActiveFilters: 'Nenhum filtro ativo',
    activeFilters: (count) => `${count} filtro${count > 1 ? 's' : ''} ativo${count > 1 ? 's' : ''}`,
    clearFilters: 'Limpar Filtros',
  },
  form: {
    editTitle: 'Editar Transação',
    createTitle: 'Nova Transação',
    account: 'Conta *',
    accountPlaceholder: 'Selecione uma conta',
    category: 'Categoria *',
    categoryPlaceholder: 'Selecione uma categoria',
    date: 'Data *',
    amount: 'Valor *',
    description: 'Descrição *',
    descriptionPlaceholder: 'Ex: Supermercado, Salário...',
    paymentType: 'Tipo de Pagamento *',
    status: 'Status *',
    notes: 'Observações',
    notesPlaceholder: 'Observações adicionais (opcional)',
    save: 'Salvar',
    saving: 'Salvando...',
    cancel: 'Cancelar',
    validation: {
      accountRequired: 'Conta é obrigatória',
      categoryRequired: 'Categoria é obrigatória',
      dateRequired: 'Data é obrigatória',
      amountMin: 'Valor deve ser maior que 0',
      descriptionRequired: 'Descrição é obrigatória',
    },
  },
  csv: {
    title: 'Importar CSV',
    supportedFormats: 'Formatos suportados: CSV, OFX e PDF',
    destinationAccount: 'Conta de destino',
    destinationAccountPlaceholder: 'Selecione uma conta',
    defaultCategory: 'Categoria padrão',
    defaultCategoryPlaceholder: 'Selecione uma categoria',
    selectFile: 'Selecionar arquivo CSV',
    expectedColumns: 'Colunas esperadas: data, descricao, valor (opcionais: tipo, status, categoria, obs).',
    read: 'Lidas',
    valid: 'Válidas',
    duplicates: 'Duplicadas',
    importDuplicates: 'Importar também linhas duplicadas',
    duplicate: 'Duplicada',
    ok: 'OK',
    cancel: 'Cancelar',
    importing: 'Importando...',
    import: 'Importar',
    selectDestinationAccount: 'Selecione uma conta de destino',
    selectDefaultCategory: 'Selecione uma categoria padrão',
    columns: {
      row: '#',
      date: 'Data',
      description: 'Descrição',
      amount: 'Valor',
      status: 'Status',
    },
  },
};

const transactionMessagesEn: TransactionMessages = {
  pageTitle: 'Transactions',
  pageSubtitle: 'Manage all of your financial transactions',
  importCsv: 'Import CSV',
  importFile: 'Import File',
  filters: 'Filters',
  newTransaction: 'New Transaction',
  totalTransactions: 'Total Transactions',
  income: 'Income',
  expenses: 'Expenses',
  confirmDelete: 'Do you really want to delete this transaction?',
  createSuccess: 'Transaction created successfully!',
  createError: 'Error creating transaction',
  updateSuccess: 'Transaction updated successfully!',
  updateError: 'Error updating transaction',
  deleteSuccess: 'Transaction deleted successfully!',
  deleteError: 'Error deleting transaction',
  importSuccess: 'Import completed successfully!',
  importError: 'Error importing file',
  table: {
    loading: 'Loading transactions...',
    empty: 'No transactions found',
    emptyHint: 'Try adjusting the filters or creating a new transaction',
    date: 'Date',
    description: 'Description',
    category: 'Category',
    account: 'Account',
    type: 'Type',
    amount: 'Amount',
    status: 'Status',
    actions: 'Actions',
    edit: 'Edit',
    delete: 'Delete',
    showing: (from, to, total) => `Showing ${from} to ${to} of ${total} transactions`,
    previous: 'Previous',
    next: 'Next',
  },
  filtersPanel: {
    searchPlaceholder: 'Search by description...',
    startDate: 'Start date',
    endDate: 'End date',
    category: 'Category',
    allCategories: 'All',
    account: 'Account',
    allAccounts: 'All',
    paymentType: 'Payment type',
    status: 'Status',
    all: 'All',
    noActiveFilters: 'No active filters',
    activeFilters: (count) => `${count} active filter${count > 1 ? 's' : ''}`,
    clearFilters: 'Clear Filters',
  },
  form: {
    editTitle: 'Edit Transaction',
    createTitle: 'New Transaction',
    account: 'Account *',
    accountPlaceholder: 'Select an account',
    category: 'Category *',
    categoryPlaceholder: 'Select a category',
    date: 'Date *',
    amount: 'Amount *',
    description: 'Description *',
    descriptionPlaceholder: 'Ex: Grocery store, Salary...',
    paymentType: 'Payment Type *',
    status: 'Status *',
    notes: 'Notes',
    notesPlaceholder: 'Additional notes (optional)',
    save: 'Save',
    saving: 'Saving...',
    cancel: 'Cancel',
    validation: {
      accountRequired: 'Account is required',
      categoryRequired: 'Category is required',
      dateRequired: 'Date is required',
      amountMin: 'Amount must be greater than 0',
      descriptionRequired: 'Description is required',
    },
  },
  csv: {
    title: 'Import CSV',
    supportedFormats: 'Supported formats: CSV, OFX and PDF',
    destinationAccount: 'Destination account',
    destinationAccountPlaceholder: 'Select an account',
    defaultCategory: 'Default category',
    defaultCategoryPlaceholder: 'Select a category',
    selectFile: 'Select CSV file',
    expectedColumns: 'Expected columns: date, description, amount (optional: type, status, category, notes).',
    read: 'Read',
    valid: 'Valid',
    duplicates: 'Duplicates',
    importDuplicates: 'Import duplicate rows too',
    duplicate: 'Duplicate',
    ok: 'OK',
    cancel: 'Cancel',
    importing: 'Importing...',
    import: 'Import',
    selectDestinationAccount: 'Select a destination account',
    selectDefaultCategory: 'Select a default category',
    columns: {
      row: '#',
      date: 'Date',
      description: 'Description',
      amount: 'Amount',
      status: 'Status',
    },
  },
};

const accountMessagesPt: AccountMessages = {
  pageTitle: 'Minhas Contas',
  pageSubtitle: 'Gerencie suas contas bancárias e cartões',
  newAccount: 'Nova Conta',
  updateSuccess: 'Conta atualizada com sucesso!',
  createSuccess: 'Conta criada com sucesso!',
  updateError: 'Erro ao atualizar conta',
  createError: 'Erro ao criar conta',
  confirmDelete: 'Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.',
  deleteSuccess: 'Conta excluída com sucesso!',
  deleteError: 'Erro ao excluir conta',
  totalBalance: 'Saldo Total',
  sinceStart: 'desde o início',
  totalAccounts: 'Total de Contas',
  activeAccounts: 'Contas ativas',
  averageBalance: 'Saldo Médio',
  perAccount: 'Por conta',
  balanceChangeFromStart: (amount) => `${amount} desde o início`,
  list: {
    emptyTitle: 'Nenhuma conta cadastrada',
    emptyHint: 'Crie sua primeira conta para começar a gerenciar suas finanças',
    currentBalance: 'Saldo Atual',
    initialBalance: 'Saldo Inicial',
    edit: 'Editar',
    delete: 'Excluir',
  },
  modal: {
    editTitle: 'Editar Conta',
    createTitle: 'Nova Conta',
    accountName: 'Nome da Conta *',
    accountNamePlaceholder: 'Ex: Banco do Brasil',
    accountType: 'Tipo de Conta *',
    initialBalance: 'Saldo Inicial',
    initialBalancePlaceholder: '0,00',
    editHint: 'Este valor não afetará o saldo atual',
    createHint: 'O saldo inicial será o saldo atual da conta',
    cancel: 'Cancelar',
    saving: 'Salvando...',
    update: 'Atualizar',
    create: 'Criar',
    validation: {
      nameRequired: 'Nome é obrigatório',
    },
  },
};

const accountMessagesEn: AccountMessages = {
  pageTitle: 'My Accounts',
  pageSubtitle: 'Manage your bank accounts and cards',
  newAccount: 'New Account',
  updateSuccess: 'Account updated successfully!',
  createSuccess: 'Account created successfully!',
  updateError: 'Error updating account',
  createError: 'Error creating account',
  confirmDelete: 'Are you sure you want to delete this account? This action cannot be undone.',
  deleteSuccess: 'Account deleted successfully!',
  deleteError: 'Error deleting account',
  totalBalance: 'Total Balance',
  sinceStart: 'since the start',
  totalAccounts: 'Total Accounts',
  activeAccounts: 'Active accounts',
  averageBalance: 'Average Balance',
  perAccount: 'Per account',
  balanceChangeFromStart: (amount) => `${amount} since the start`,
  list: {
    emptyTitle: 'No accounts yet',
    emptyHint: 'Create your first account to start managing your finances',
    currentBalance: 'Current Balance',
    initialBalance: 'Initial Balance',
    edit: 'Edit',
    delete: 'Delete',
  },
  modal: {
    editTitle: 'Edit Account',
    createTitle: 'New Account',
    accountName: 'Account Name *',
    accountNamePlaceholder: 'Ex: Main Checking',
    accountType: 'Account Type *',
    initialBalance: 'Initial Balance',
    initialBalancePlaceholder: '0.00',
    editHint: 'This value will not affect the current balance',
    createHint: 'The initial balance will become the current balance for this account',
    cancel: 'Cancel',
    saving: 'Saving...',
    update: 'Update',
    create: 'Create',
    validation: {
      nameRequired: 'Name is required',
    },
  },
};

const navbarMessagesPt: NavbarMessages = {
  greeting: (firstName) => `Oi, ${firstName}! Bem-vindo de volta.`,
  subtitle: 'Gerencie seus cartões e confira suas transações recentes.',
  searchPlaceholder: 'Pesquisar ou digitar um comando',
};

const navbarMessagesEn: NavbarMessages = {
  greeting: (firstName) => `Hi, ${firstName}! Welcome back.`,
  subtitle: 'Manage your cards and review recent transactions.',
  searchPlaceholder: 'Search or type a command',
};

const paymentTypeLabelsPt = {
  DEBIT: 'Débito',
  CREDIT: 'Crédito',
  PIX: 'PIX',
  CASH: 'Dinheiro',
  TRANSFER: 'Transferência',
};

const paymentTypeLabelsEn = {
  DEBIT: 'Debit',
  CREDIT: 'Credit',
  PIX: 'PIX',
  CASH: 'Cash',
  TRANSFER: 'Transfer',
};

const transactionStatusLabelsPt = {
  PENDING: 'Pendente',
  PAID: 'Pago',
  CANCELLED: 'Cancelado',
};

const transactionStatusLabelsEn = {
  PENDING: 'Pending',
  PAID: 'Paid',
  CANCELLED: 'Cancelled',
};

const accountTypeLabelsPt = {
  CHECKING: 'Conta Corrente',
  SAVINGS: 'Poupança',
  CREDIT_CARD: 'Cartão de Crédito',
};

const accountTypeLabelsEn = {
  CHECKING: 'Checking Account',
  SAVINGS: 'Savings Account',
  CREDIT_CARD: 'Credit Card',
};

const isPortuguese = (locale: Locale) => locale === 'pt-BR';

export const getTransactionMessages = (locale: Locale) =>
  (isPortuguese(locale) ? transactionMessagesPt : transactionMessagesEn);

export const getAccountMessages = (locale: Locale) =>
  (isPortuguese(locale) ? accountMessagesPt : accountMessagesEn);

export const getNavbarMessages = (locale: Locale) =>
  (isPortuguese(locale) ? navbarMessagesPt : navbarMessagesEn);

export const getPaymentTypeLabel = (type: string, locale: Locale) => {
  const labels = isPortuguese(locale) ? paymentTypeLabelsPt : paymentTypeLabelsEn;
  return labels[type as keyof typeof labels] || type;
};

export const getTransactionStatusLabel = (status: string, locale: Locale) => {
  const labels = isPortuguese(locale) ? transactionStatusLabelsPt : transactionStatusLabelsEn;
  return labels[status as keyof typeof labels] || status;
};

export const getAccountTypeLabel = (type: string, locale: Locale) => {
  const labels = isPortuguese(locale) ? accountTypeLabelsPt : accountTypeLabelsEn;
  return labels[type as keyof typeof labels] || type;
};