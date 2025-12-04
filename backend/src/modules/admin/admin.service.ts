import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';

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

export async function updateUserRole(userId: string, role: 'admin' | 'user') {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { role },
  });
  
  return user;
}

export async function updateUserPlan(userId: string, plan: 'free' | 'pro' | 'elite') {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });
  
  return user;
}

export async function getSetting(key: string) {
  const setting = await prisma.setting.findUnique({ where: { key } });
  return setting?.value;
}

export async function updateSetting(key: string, value: any) {
  const setting = await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  
  return setting;
}
