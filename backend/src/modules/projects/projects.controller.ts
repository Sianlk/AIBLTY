import { Request, Response, NextFunction } from 'express';
import * as projectsService from './projects.service';

export async function createProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.createProject(req.user!.userId, req.body);
    res.status(201).json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function getProjects(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await projectsService.getProjects(req.user!.userId, page, limit);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.getProject(req.user!.userId, req.params.id);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function updateProject(req: Request, res: Response, next: NextFunction) {
  try {
    const project = await projectsService.updateProject(req.user!.userId, req.params.id, req.body);
    res.json({ success: true, data: project });
  } catch (error) {
    next(error);
  }
}

export async function deleteProject(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await projectsService.deleteProject(req.user!.userId, req.params.id);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
