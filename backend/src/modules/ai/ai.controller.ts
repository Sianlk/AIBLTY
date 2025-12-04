import { Request, Response, NextFunction } from 'express';
import * as aiService from './ai.service';

export async function solveProblem(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, prompt } = req.body;
    const result = await aiService.solveProblem(req.user!.userId, projectId, prompt);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function buildBusiness(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, prompt } = req.body;
    const result = await aiService.buildBusiness(req.user!.userId, projectId, prompt);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function runAutomation(req: Request, res: Response, next: NextFunction) {
  try {
    const { projectId, prompt } = req.body;
    const result = await aiService.runAutomation(req.user!.userId, projectId, prompt);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function chat(req: Request, res: Response, next: NextFunction) {
  try {
    const { sessionId, prompt } = req.body;
    const result = await aiService.chat(req.user!.userId, sessionId, prompt);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
