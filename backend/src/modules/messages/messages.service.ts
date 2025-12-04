import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';
import { MessageRole } from '@prisma/client';

export async function createMessage(userId: string, sessionId: string, data: { role: MessageRole; content: string; metadata?: any }) {
  // Verify session ownership
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { project: { select: { userId: true } } },
  });
  
  if (!session || session.project.userId !== userId) {
    throw new AppError('Session not found', 404);
  }
  
  const message = await prisma.message.create({
    data: {
      sessionId,
      role: data.role,
      content: data.content,
      metadata: data.metadata,
    },
  });
  
  return message;
}

export async function getMessages(userId: string, sessionId: string, page = 1, limit = 50) {
  const session = await prisma.session.findUnique({
    where: { id: sessionId },
    include: { project: { select: { userId: true } } },
  });
  
  if (!session || session.project.userId !== userId) {
    throw new AppError('Session not found', 404);
  }
  
  const skip = (page - 1) * limit;
  
  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: 'asc' },
      skip,
      take: limit,
    }),
    prisma.message.count({ where: { sessionId } }),
  ]);
  
  return {
    messages,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
