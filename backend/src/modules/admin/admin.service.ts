import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { z } from 'zod';

// Input validation schemas
const roleSchema = z.enum(['admin', 'user'], {
  errorMap: () => ({ message: 'Role must be "admin" or "user"' }),
});

const planSchema = z.enum(['free', 'starter', 'pro', 'elite'], {
  errorMap: () => ({ message: 'Plan must be "free", "starter", "pro", or "elite"' }),
});

const settingKeySchema = z
  .string()
  .trim()
  .min(1, 'Setting key is required')
  .max(100, 'Setting key must be less than 100 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'Setting key must contain only alphanumeric characters and underscores');

const userIdSchema = z.string().uuid('Invalid user ID format');

export async function getAllUsers(page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        plan: true,
        createdAt: true,
        _count: { select: { projects: true, subscriptions: true } },
      },
    }),
    prisma.user.count(),
  ]);
  
  return {
    users,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getStats() {
  const [
    totalUsers,
    activeSubscriptions,
    totalProjects,
    totalRevenue,
    usersByPlan,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.subscription.count({ where: { status: 'active' } }),
    prisma.project.count(),
    prisma.payment.aggregate({
      where: { status: 'succeeded' },
      _sum: { amount: true },
    }),
    prisma.user.groupBy({
      by: ['plan'],
      _count: true,
    }),
  ]);
  
  const planCounts = usersByPlan.reduce((acc, item) => {
    acc[item.plan] = item._count;
    return acc;
  }, {} as Record<string, number>);
  
  return {
    totalUsers,
    activeSubscriptions,
    totalProjects,
    totalRevenue: (totalRevenue._sum.amount || 0) / 100, // Convert cents to dollars
    usersByPlan: planCounts,
  };
}

export async function getAllPayments(page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.payment.count(),
  ]);
  
  return {
    payments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getAllDeployments(page = 1, limit = 50) {
  const skip = (page - 1) * limit;
  
  const [deployments, total] = await Promise.all([
    prisma.deployment.findMany({
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        user: { select: { email: true, name: true } },
      },
    }),
    prisma.deployment.count(),
  ]);
  
  return {
    deployments,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function updateUserRole(userId: string, role: string) {
  // Validate inputs
  const validatedUserId = userIdSchema.safeParse(userId);
  if (!validatedUserId.success) {
    throw new AppError(validatedUserId.error.errors[0].message, 400);
  }
  
  const validatedRole = roleSchema.safeParse(role);
  if (!validatedRole.success) {
    throw new AppError(validatedRole.error.errors[0].message, 400);
  }
  
  const user = await prisma.user.update({
    where: { id: validatedUserId.data },
    data: { role: validatedRole.data },
  });
  
  return user;
}

export async function updateUserPlan(userId: string, plan: string) {
  // Validate inputs
  const validatedUserId = userIdSchema.safeParse(userId);
  if (!validatedUserId.success) {
    throw new AppError(validatedUserId.error.errors[0].message, 400);
  }
  
  const validatedPlan = planSchema.safeParse(plan);
  if (!validatedPlan.success) {
    throw new AppError(validatedPlan.error.errors[0].message, 400);
  }
  
  const user = await prisma.user.update({
    where: { id: validatedUserId.data },
    data: { plan: validatedPlan.data },
  });
  
  return user;
}

export async function getSetting(key: string) {
  // Validate key format
  const validatedKey = settingKeySchema.safeParse(key);
  if (!validatedKey.success) {
    throw new AppError(validatedKey.error.errors[0].message, 400);
  }
  
  const setting = await prisma.setting.findUnique({ where: { key: validatedKey.data } });
  return setting?.value;
}

export async function updateSetting(key: string, value: unknown) {
  // Validate key format
  const validatedKey = settingKeySchema.safeParse(key);
  if (!validatedKey.success) {
    throw new AppError(validatedKey.error.errors[0].message, 400);
  }
  
  // Validate value is serializable and not too large
  let serializedValue: string;
  try {
    serializedValue = JSON.stringify(value);
    if (serializedValue.length > 10000) {
      throw new AppError('Setting value is too large (max 10KB)', 400);
    }
  } catch {
    throw new AppError('Setting value must be JSON serializable', 400);
  }
  
  const setting = await prisma.setting.upsert({
    where: { key: validatedKey.data },
    update: { value },
    create: { key: validatedKey.data, value },
  });
  
  return setting;
}
