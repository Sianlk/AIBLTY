import { prisma } from '../../config/db';
import { isAdmin, env } from '../../config/env';
import { signToken, JWTPayload } from '../../utils/jwt';
import bcrypt from 'bcryptjs';
import { AppError } from '../../middleware/errorHandler';

export interface RegisterInput {
  email: string;
  password: string;
  name?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function register(input: RegisterInput) {
  const { email, password, name } = input;
  
  const existingUser = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (existingUser) {
    throw new AppError('Email already registered', 400);
  }
  
  const passwordHash = await bcrypt.hash(password, 12);
  const isAdminUser = isAdmin(email);
  
  const user = await prisma.user.create({
    data: {
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: isAdminUser ? 'admin' : 'user',
      plan: isAdminUser ? 'elite' : 'free',
    },
  });
  
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  };
  
  const accessToken = signToken(payload);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
    },
    accessToken,
  };
}

export async function login(input: LoginInput) {
  const { email, password } = input;
  
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }
  
  const validPassword = await bcrypt.compare(password, user.passwordHash);
  if (!validPassword) {
    throw new AppError('Invalid credentials', 401);
  }
  
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  };
  
  const accessToken = signToken(payload);
  
  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      plan: user.plan,
    },
    accessToken,
  };
}

export async function refreshToken(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    plan: user.plan,
  };
  
  return signToken(payload);
}

export async function requestPasswordReset(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user) {
    // Don't reveal if email exists
    return { message: 'If email exists, reset instructions sent' };
  }
  
  // In production, generate a reset token and send email
  // For now, just acknowledge
  return { message: 'If email exists, reset instructions sent' };
}

export async function resetPassword(token: string, newPassword: string) {
  // In production, verify the reset token from DB/cache
  // For MVP, this is a placeholder
  throw new AppError('Password reset not yet implemented', 501);
}

export async function getMe(userId: string) {
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
    },
  });
  
  if (!user) {
    throw new AppError('User not found', 404);
  }
  
  return user;
}
