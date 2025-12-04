import { Request, Response, NextFunction } from 'express';
import * as filesService from './files.service';

export async function uploadFile(req: Request, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' });
    }
    const file = await filesService.uploadFile(req.user!.userId, req.file);
    res.status(201).json({ success: true, data: file });
  } catch (error) {
    next(error);
  }
}

export async function getFile(req: Request, res: Response, next: NextFunction) {
  try {
    const { file, buffer } = await filesService.getFile(req.user!.userId, req.params.id);
    res.setHeader('Content-Type', file.mimetype);
    res.setHeader('Content-Disposition', `inline; filename="${file.filename}"`);
    res.send(buffer);
  } catch (error) {
    next(error);
  }
}

export async function listFiles(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await filesService.listFiles(req.user!.userId, page);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function deleteFile(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await filesService.deleteFile(req.user!.userId, req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
