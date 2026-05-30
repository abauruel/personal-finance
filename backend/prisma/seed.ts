import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as pg from 'pg';
import 'dotenv/config';

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const defaultCategories = [
  { name: 'Moradia', icon: '🏠', color: '#3B82F6' },
  { name: 'Contas', icon: '⚡', color: '#F59E0B' },
  { name: 'Alimentação', icon: '🍔', color: '#10B981' },
  { name: 'Transporte', icon: '🚗', color: '#6366F1' },
  { name: 'Saúde', icon: '🏥', color: '#EF4444' },
  { name: 'Educação', icon: '🎓', color: '#8B5CF6' },
  { name: 'Lazer', icon: '🎮', color: '#EC4899' },
  { name: 'Vestuário', icon: '👕', color: '#14B8A6' },
  { name: 'Investimentos', icon: '💰', color: '#F97316' },
  { name: 'Outros', icon: '🎁', color: '#6B7280' },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Create a test user (for development only)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: '$2b$10$YourHashedPasswordHere', // This should be hashed in production
      name: 'Test User',
    },
  });

  console.log('✅ Test user created:', testUser.email);

  // Create default categories for the test user
  for (const category of defaultCategories) {
    const existing = await prisma.category.findFirst({
      where: {
        userId: testUser.id,
        name: category.name,
      },
    });

    if (!existing) {
      await prisma.category.create({
        data: {
          userId: testUser.id,
          name: category.name,
          icon: category.icon,
          color: category.color,
          isDefault: true,
        },
      });
    }
  }

  console.log('✅ Default categories created');

  // Create a test checking account
  const checkingAccount = await prisma.account.create({
    data: {
      userId: testUser.id,
      name: 'Conta Corrente',
      type: 'CHECKING',
      initialBalance: 1000.0,
      currentBalance: 1000.0,
      active: true,
    },
  });

  console.log('✅ Test account created:', checkingAccount.name);

  console.log('🎉 Seeding completed!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
