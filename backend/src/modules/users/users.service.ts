import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import bcrypt from 'bcryptjs';

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      plan: true,
      avatarUrl: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
}

export async function updateUser(userId: string, data: { name?: string; avatarUrl?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      plan: true,
      avatarUrl: true,
    },
  });
  
  return user;
}

export async function updatePassword(userId: string, currentPassword: string, newPassword: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  const validPassword = await bcrypt.compare(currentPassword, user.passwordHash);
  if (!validPassword) {
    throw new AppError('Current password is incorrect', 400);
  }
  
  const passwordHash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
  
  return { message: 'Password updated successfully' };
}

export async function deleteUser(userId: string) {
  await prisma.user.delete({ where: { id: userId } });
  return { message: 'Account deleted successfully' };
}
