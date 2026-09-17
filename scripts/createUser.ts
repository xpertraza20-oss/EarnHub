import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  const email = 'xpertraza13@gmail.com';
  const password = 'ali123';
  
  // check if exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('User already exists');
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 12);
  const referralCode = crypto.randomBytes(4).toString('hex').toUpperCase();

  const user = await prisma.user.create({
    data: {
      email,
      name: 'Xpert Raza',
      password: hashedPassword,
      role: 'admin', // Make admin just in case
      referralCode,
      balance: 100 // Give some starting balance
    }
  });

  console.log(`Successfully created user: ${user.email}`);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
