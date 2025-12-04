import { Request, Response, NextFunction } from 'express';
import * as sessionsService from './sessions.service';

export async function createSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionsService.createSession(req.user!.userId, req.params.projectId, req.body);
    res.status(201).json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
}

export async function getSessions(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await sessionsService.getSessions(req.user!.userId, req.params.projectId, page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getSession(req: Request, res: Response, next: NextFunction) {
  try {
    const session = await sessionsService.getSession(req.user!.userId, req.params.id);
    res.json({ success: true, data: session });
  } catch (error) {
    next(error);
  }
}

export async function deleteSession(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await sessionsService.deleteSession(req.user!.userId, req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
