import { prisma } from '../../config/db';
import { env } from '../../config/env';
import { AppError } from '../../middleware/errorHandler';
import path from 'path';
import fs from 'fs';
import { v4 as uuid } from 'uuid';

const STORAGE_PATH = env.STORAGE_PATH;

// Ensure storage directory exists
if (!fs.existsSync(STORAGE_PATH)) {
  fs.mkdirSync(STORAGE_PATH, { recursive: true });
}

export async function uploadFile(userId: string, file: Express.Multer.File) {
  const fileId = uuid();
  const ext = path.extname(file.originalname);
  const filename = `${fileId}${ext}`;
  const filepath = path.join(STORAGE_PATH, filename);
  
  // Move file to storage
  fs.writeFileSync(filepath, file.buffer);
  
  const savedFile = await prisma.file.create({
    data: {
      id: fileId,
      userId,
      filename: file.originalname,
      path: filename,
      mimetype: file.mimetype,
      size: file.size,
    },
  });
  
  return savedFile;
}

export async function getFile(userId: string, fileId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, userId },
  });
  
  if (!file) {
    throw new AppError('File not found', 404);
  }
  
  const filepath = path.join(STORAGE_PATH, file.path);
  
  if (!fs.existsSync(filepath)) {
    throw new AppError('File not found on disk', 404);
  }
  
  return {
    file,
    filepath,
    buffer: fs.readFileSync(filepath),
  };
}

export async function listFiles(userId: string, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  
  const [files, total] = await Promise.all([
    prisma.file.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.file.count({ where: { userId } }),
  ]);
  
  return {
    files,
    pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}

export async function deleteFile(userId: string, fileId: string) {
  const file = await prisma.file.findFirst({
    where: { id: fileId, userId },
  });
  
  if (!file) {
    throw new AppError('File not found', 404);
  }
  
  const filepath = path.join(STORAGE_PATH, file.path);
  
  if (fs.existsSync(filepath)) {
    fs.unlinkSync(filepath);
  }
  
  await prisma.file.delete({ where: { id: fileId } });
  
  return { message: 'File deleted' };
}
