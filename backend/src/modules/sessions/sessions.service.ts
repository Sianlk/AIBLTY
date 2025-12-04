import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { SessionType } from '@prisma/client';

export async function createSession(userId: string, projectId: string, data: { type?: SessionType; title?: string }) {
  // Verify project ownership
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  const session = await prisma.session.create({
    data: {
      projectId,
      type: data.type || 'chat',
      title: data.title,
    },
  });
  
  return session;
}

export async function getSessions(userId: string, projectId: string, page = 1, limit = 20) {
  // Verify project ownership
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  const skip = (page - 1) * limit;
  
  const [sessions, total] = await Promise.all([
    prisma.session.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: { select: { messages: true } },
      },
    }),
    prisma.session.count({ where: { projectId } }),
  ]);
  
  return {
    sessions,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function getSession(userId: string, sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: {
      project: { select: { userId: true } },
      messages: { orderBy: { createdAt: 'asc' } },
    },
  });
  
  if (!session || session.project.userId !== userId) {
    throw new AppError('Session not found', 404);
  }
  
  return session;
}

export async function deleteSession(userId: string, sessionId: string) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { project: { select: { userId: true } } },
  });
  
  if (!session || session.project.userId !== userId) {
    throw new AppError('Session not found', 404);
  }
  
  await prisma.session.delete({ where: { id: sessionId } });
  return { message: 'Session deleted' };
}
