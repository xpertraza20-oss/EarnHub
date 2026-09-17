import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.user.delete({
      where: { email: 'admin@earnhub.com' }
    });
    console.log("Deleted old demo admin account");
  } catch(e) {
    console.log("Account already deleted or error:", e);
  }
}
main().finally(() => prisma.$disconnect());
