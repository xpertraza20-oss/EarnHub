import db from './db';

export async function checkDuplicateAccount(email: string, phone?: string): Promise<boolean> {
  const existingEmail = await db.user.findUnique({
    where: { email }
  });
  
  if (existingEmail) return true;
  
  if (phone) {
    const existingPhone = await db.user.findFirst({
      where: { phone }
    });
    if (existingPhone) return true;
  }
  
  return false;
}

export async function validateEmail(email: string): Promise<boolean> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export async function validatePhone(phone: string): Promise<boolean> {
  const phoneRegex = /^(\+92|0)?[0-9]{10}$/;
  return phoneRegex.test(phone);
}