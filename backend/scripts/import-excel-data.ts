import * as XLSX from 'xlsx';
import * as path from 'path';
import { PrismaClient, PaymentType, TransactionStatus, AccountType } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

// Criar PrismaClient com adapter PostgreSQL
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Mapeamento de meses
const MONTH_MAP: Record<string, number> = {
  'jan': 1, 'janeiro': 1, 'janneiro': 1,
  'fev': 2, 'fevereiro': 2,
  'mar': 3, 'marco': 3, 'março': 3,
  'abr': 4, 'abril': 4,
  'mai': 5, 'maio': 5,
  'jun': 6, 'junho': 6,
  'jul': 7, 'julho': 7,
  'ago': 8, 'agosto': 8,
  'set': 9, 'setembro': 9,
  'out': 10, 'outubro': 10,
  'nov': 11, 'novembro': 11,
  'dez': 12, 'dezembro': 12
};

// Mapeamento de formas de pagamento
const PAYMENT_TYPE_MAP: Record<string, PaymentType> = {
  'boleto': PaymentType.TRANSFER,
  'debito automatico': PaymentType.DEBIT,
  'pix': PaymentType.PIX,
  'dinheiro': PaymentType.CASH,
  'nubank card': PaymentType.CREDIT,
  'bradesco cartoes': PaymentType.CREDIT,
  'cartao': PaymentType.CREDIT,
  'credito': PaymentType.CREDIT,
  'debito': PaymentType.DEBIT,
};

// Mapeamento de situação
const STATUS_MAP: Record<string, TransactionStatus> = {
  'pg': TransactionStatus.PAID,
  'open': TransactionStatus.PENDING,
  'closed': TransactionStatus.CANCELLED,
  'pago': TransactionStatus.PAID,
  'pendente': TransactionStatus.PENDING,
  'cancelado': TransactionStatus.CANCELLED,
};

interface ExcelRow {
  ma?: string; // descrição
  dia?: number;
  valor?: number;
  situacao?: string;
  'forma de pagamento'?: string;
  beneficiado?: string;
  outcome?: string; // conta
  subclassificacao?: string;
  'centro de custo'?: string;
  categoria?: string;
  'tipo de despesas'?: string;
  tag?: string;
}

// Parsear nome da aba para extrair mês e ano
function parseSheetName(sheetName: string): { month: number; year: number } | null {
  // Remover espaços e converter para minúsculas
  const normalized = sheetName.toLowerCase().trim();
  
  // Tentar padrões: jan26, janeiro23, setembro22, etc.
  const patterns = [
    /^(\w+)(\d{2})$/, // jan26, set25
    /^(\w+)\s*(\d{2})$/, // jan 26
  ];
  
  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (match) {
      const monthStr = match[1];
      const yearStr = match[2];
      
      const month = MONTH_MAP[monthStr];
      if (month) {
        const year = 2000 + parseInt(yearStr);
        return { month, year };
      }
    }
  }
  
  return null;
}

// Normalizar categoria
function normalizeCategory(category: string | undefined | null): string {
  if (!category || typeof category !== 'string') return 'outros';
  return category.trim().toLowerCase();
}

// Normalizar conta
function normalizeAccount(account: string | undefined | null): string {
  if (!account || typeof account !== 'string') return 'Outros';
  return account.trim().toLowerCase();
}

// Mapear tipo de pagamento
function mapPaymentType(paymentType: string | undefined): PaymentType {
  if (!paymentType) return PaymentType.CASH;
  
  const normalized = paymentType.toLowerCase().trim();
  return PAYMENT_TYPE_MAP[normalized] || PaymentType.CASH;
}

// Mapear status
function mapStatus(status: string | undefined): TransactionStatus {
  if (!status) return TransactionStatus.PENDING;
  
  const normalized = status.toLowerCase().trim();
  return STATUS_MAP[normalized] || TransactionStatus.PENDING;
}

async function main() {
  console.log('🚀 Iniciando importação de dados do Excel...\n');
  
  // 1. Criar ou buscar usuário
  console.log('👤 Criando/buscando usuário...');
  const hashedPassword = await bcrypt.hash('123456', 10);
  const user = await prisma.user.upsert({
    where: { email: 'alex@example.com' },
    update: {},
    create: {
      email: 'alex@example.com',
      password: hashedPassword,
      name: 'Alex Bauruel',
    },
  });
  console.log(`✅ Usuário: ${user.email} (${user.id})\n`);
  
  // 2. Ler arquivo Excel
  const excelFilePath = path.join(__dirname, '../../setembro22.xlsx');
  console.log(`📄 Lendo arquivo: ${excelFilePath}`);
  const workbook = XLSX.readFile(excelFilePath);
  
  // 3. Filtrar abas mensais (ignorar resumos e outras abas especiais)
  const monthlySheets = workbook.SheetNames.filter(name => {
    const parsed = parseSheetName(name);
    return parsed !== null;
  });
  
  console.log(`📊 Abas mensais encontradas: ${monthlySheets.length}`);
  console.log(monthlySheets.join(', ') + '\n');
  
  // 4. Coletar todas as contas e categorias únicas primeiro
  const accountsSet = new Set<string>();
  const categoriesSet = new Set<string>();
  
  console.log('🔍 Analisando dados para criar contas e categorias...');
  
  for (const sheetName of monthlySheets) {
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
    
    data.forEach(row => {
      if (row.outcome) {
        accountsSet.add(normalizeAccount(row.outcome));
      }
      if (row.categoria) {
        categoriesSet.add(normalizeCategory(row.categoria));
      }
    });
  }
  
  console.log(`  Contas únicas: ${accountsSet.size}`);
  console.log(`  Categorias únicas: ${categoriesSet.size}\n`);
  
  // 5. Criar contas
  console.log('🏦 Criando contas...');
  const accountMap = new Map<string, string>();
  
  for (const accountName of Array.from(accountsSet)) {
    const account = await prisma.account.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: accountName,
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: accountName,
        type: accountName.includes('card') || accountName.includes('cartao') 
          ? AccountType.CREDIT_CARD 
          : AccountType.CHECKING,
        initialBalance: 0,
        currentBalance: 0,
      },
    });
    accountMap.set(accountName, account.id);
    console.log(`  ✓ ${accountName}`);
  }
  console.log(`✅ ${accountMap.size} contas criadas\n`);
  
  // 6. Criar categorias
  console.log('📁 Criando categorias...');
  const categoryMap = new Map<string, string>();
  const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E2'];
  const icons = ['💰', '🏠', '🍔', '🚗', '🎓', '💊', '🎮', '🎬', '🛒', '✈️'];
  
  let colorIndex = 0;
  let iconIndex = 0;
  
  for (const categoryName of Array.from(categoriesSet)) {
    const category = await prisma.category.upsert({
      where: {
        userId_name: {
          userId: user.id,
          name: categoryName,
        },
      },
      update: {},
      create: {
        userId: user.id,
        name: categoryName,
        color: colors[colorIndex % colors.length],
        icon: icons[iconIndex % icons.length],
      },
    });
    categoryMap.set(categoryName, category.id);
    console.log(`  ✓ ${categoryName}`);
    colorIndex++;
    iconIndex++;
  }
  console.log(`✅ ${categoryMap.size} categorias criadas\n`);
  
  // 7. Importar transações
  console.log('💳 Importando transações...\n');
  
  let totalImported = 0;
  let totalSkipped = 0;
  
  for (const sheetName of monthlySheets) {
    const parsed = parseSheetName(sheetName);
    if (!parsed) continue;
    
    const { month, year } = parsed;
    console.log(`\n📅 Processando: ${sheetName} (${month}/${year})`);
    
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json<ExcelRow>(worksheet);
    
    let imported = 0;
    let skipped = 0;
    
    for (const row of data) {
      // Validar dados obrigatórios
      if (!row.ma || !row.dia || row.valor === undefined || row.valor === null) {
        skipped++;
        continue;
      }
      
      // Ignorar linhas com valor 0 ou negativo
      if (row.valor <= 0) {
        skipped++;
        continue;
      }
      
      const accountName = normalizeAccount(row.outcome);
      const categoryName = normalizeCategory(row.categoria);
      
      const accountId = accountMap.get(accountName);
      const categoryId = categoryMap.get(categoryName);
      
      if (!accountId || !categoryId) {
        console.log(`  ⚠️  Conta ou categoria não encontrada: ${accountName} / ${categoryName}`);
        skipped++;
        continue;
      }
      
      // Criar data da transação
      const day = Math.max(1, Math.min(31, row.dia || 1));
      const date = new Date(year, month - 1, day);
      
      // Criar transação
      try {
        await prisma.transaction.create({
          data: {
            userId: user.id,
            accountId,
            categoryId,
            date,
            amount: row.valor,
            description: row.ma,
            paymentType: mapPaymentType(row['forma de pagamento']),
            status: mapStatus(row.situacao),
            isRecurring: row['tipo de despesas']?.toLowerCase() === 'fixa',
            notes: row.beneficiado || null,
          },
        });
        imported++;
      } catch (error) {
        console.log(`  ❌ Erro ao importar: ${row.ma} - ${error.message}`);
        skipped++;
      }
    }
    
    console.log(`  ✅ Importadas: ${imported} | ⚠️ Ignoradas: ${skipped}`);
    totalImported += imported;
    totalSkipped += skipped;
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`\n✨ Importação concluída!`);
  console.log(`   Total importado: ${totalImported} transações`);
  console.log(`   Total ignorado: ${totalSkipped} linhas`);
  console.log(`   Contas criadas: ${accountMap.size}`);
  console.log(`   Categorias criadas: ${categoryMap.size}`);
  console.log(`\n📧 Credenciais de acesso:`);
  console.log(`   Email: ${user.email}`);
  console.log(`   Senha: 123456`);
  console.log('\n' + '='.repeat(50));
}

main()
  .catch((error) => {
    console.error('❌ Erro durante importação:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
