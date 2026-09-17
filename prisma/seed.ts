import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient() as any;

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('ali123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'xpertraza13@gmail.com' },
    update: {
      password: adminPassword,
      role: 'admin'
    },
    create: {
      name: 'Admin',
      email: 'xpertraza13@gmail.com',
      password: adminPassword,
      phone: '03000000000',
      referralCode: 'ADMIN00',
      status: 'active',
      role: 'admin'
    }
  });
  console.log('✅ Admin user created:', admin.email);

  // Create demo tasks
  const demoTasks = [
    {
      title: 'Complete Survey - Shopping Habits',
      description: 'Answer 15 questions about your shopping preferences. Takes 5-10 minutes.',
      rewardAmount: 50,
      category: 'survey',
      status: 'active'
    },
    {
      title: 'Install & Use App - 30 Seconds',
      description: 'Download the app, open it and use for 30 seconds to earn rewards.',
      rewardAmount: 30,
      category: 'app',
      status: 'active'
    },
    {
      title: 'Play Game - Reach Level 5',
      description: 'Download the game and reach level 5 to earn rewards.',
      rewardAmount: 100,
      category: 'game',
      status: 'active'
    },
    {
      title: 'Sign Up - Free Trial',
      description: 'Create a free account on our partner website.',
      rewardAmount: 40,
      category: 'signup',
      status: 'active'
    },
    {
      title: 'Survey - Travel Preferences',
      description: 'Share your travel preferences in this short survey.',
      rewardAmount: 75,
      category: 'survey',
      status: 'active'
    },
    {
      title: 'Install App - Finance',
      description: 'Download and install this finance app.',
      rewardAmount: 25,
      category: 'app',
      status: 'active'
    },
    {
      title: 'Watch Video - 60 Seconds',
      description: 'Watch a promotional video for 60 seconds.',
      rewardAmount: 15,
      category: 'survey',
      status: 'active'
    },
    {
      title: 'Sign Up - Newsletter',
      description: 'Subscribe to our partner newsletter.',
      rewardAmount: 20,
      category: 'signup',
      status: 'active'
    }
  ];

  for (const task of demoTasks) {
    await prisma.task.create({ data: task });
  }
  console.log('✅ Demo tasks created:', demoTasks.length);

  // Create demo provider (inactive - waiting for real API keys)
  const providers = [
    {
      name: 'BitLabs',
      status: 'inactive',
      commissionRate: 0.2
    },
    {
      name: 'AdGate',
      status: 'inactive',
      commissionRate: 0.25
    },
    {
      name: 'OfferToro',
      status: 'inactive',
      commissionRate: 0.3
    }
  ];

  for (const provider of providers) {
    const stringId = String(providers.indexOf(provider) + 1);
    await prisma.provider.upsert({
      where: { id: stringId },
      update: {},
      create: { ...provider, id: stringId }
    });
  }
  console.log('✅ Providers created:', providers.length);

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });