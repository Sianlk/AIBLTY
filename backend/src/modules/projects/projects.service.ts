import { prisma } from '../../config/db';
import { AppError } from '../../middleware/errorHandler';

export async function createProject(userId: string, data: { title: string; description?: string }) {
  const project = await prisma.project.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
    },
  });
  
  return project;
}

export async function getProjects(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      skip,
      take: limit,
      include: {
        _count: { select: { sessions: true } },
      },
    }),
    prisma.project.count({ where: { userId } }),
  ]);
  
  return {
    projects,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function getProject(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({
    where: { id: projectId, userId },
    include: {
      sessions: {
        orderBy: { createdAt: 'desc' },
        take: 10,
      },
    },
  });
  
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  return project;
}

export async function updateProject(userId: string, projectId: string, data: { title?: string; description?: string; status?: string }) {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  return prisma.project.update({
    where: { id: projectId },
    data,
  });
}

export async function deleteProject(userId: string, projectId: string) {
  const project = await prisma.project.findFirst({ where: { id: projectId, userId } });
  if (!project) {
    throw new AppError('Project not found', 404);
  }
  
  await prisma.project.delete({ where: { id: projectId } });
  return { message: 'Project deleted' };
}
