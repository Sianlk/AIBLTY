import { Request, Response, NextFunction } from 'express';
import * as messagesService from './messages.service';

export async function createMessage(req: Request, res: Response, next: NextFunction) {
  try {
    const message = await messagesService.createMessage(req.user!.userId, req.params.sessionId, req.body);
    res.status(201).json({ success: true, data: message });
  } catch (error) {
    next(error);
  }
}

export async function getMessages(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const result = await messagesService.getMessages(req.user!.userId, req.params.sessionId, page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
