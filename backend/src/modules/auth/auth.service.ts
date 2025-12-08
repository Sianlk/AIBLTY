import { prisma } from '../../config/db';
import { isAdmin, env } from '../../config/env';
import { signToken, JWTPayload } from '../../utils/jwt';
import bcrypt from 'bcryptjs';
import { AppError } from '../../middleware/errorHandler';
import { z } from 'zod';

// Input validation schemas
const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email is required')
  .max(255, 'Email must be less than 255 characters')
  .email('Invalid email format')
  .toLowerCase();

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

const nameSchema = z
  .string()
  .trim()
  .max(100, 'Name must be less than 100 characters')
  .optional();

const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: nameSchema,
});

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required').max(128, 'Password must be less than 128 characters'),
});

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
  // Validate input
  const validation = registerSchema.safeParse(input);
  if (!validation.success) {
    const errorMessage = validation.error.errors.map(e => e.message).join(', ');
    throw new AppError(errorMessage, 400);
  }
  
  const { email, password, name } = validation.data;
  
  const existingUser = await prisma.user.findUnique({ where: { email } });
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
  // Validate input
  const validation = loginSchema.safeParse(input);
  if (!validation.success) {
    const errorMessage = validation.error.errors.map(e => e.message).join(', ');
    throw new AppError(errorMessage, 400);
  }
  
  const { email, password } = validation.data;
  
  const user = await prisma.user.findUnique({ where: { email } });
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
