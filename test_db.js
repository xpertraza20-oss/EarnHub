const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { getUserFromToken, generateToken } = require('./src/lib/auth.ts'); // Can't easily require TS

async function main() {
  const user = await prisma.user.findFirst({ where: { email: 'xpertraza13@gmail.com' } });
  if (!user) {
    console.log("User not found");
    return;
  }
  
  // Try fetching with avatar included
  try {
    const fetched = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        name: true,
        avatar: true
      }
    });
    console.log("Success:", fetched);
  } catch (e) {
    console.error("Prisma error:", e.message);
  }
}
main().finally(() => prisma.$disconnect());
