import { Request, Response, NextFunction } from 'express';
import * as deployService from './deploy.service';

export async function triggerDeployment(req: Request, res: Response, next: NextFunction) {
  try {
    const { target, config } = req.body;
    const deployment = await deployService.triggerDeployment(req.user!.userId, target || 'vps', config);
    res.status(201).json({ success: true, data: deployment });
  } catch (error) {
    next(error);
  }
}

export async function getDeployment(req: Request, res: Response, next: NextFunction) {
  try {
    const deployment = await deployService.getDeployment(req.user!.userId, req.params.id);
    res.json({ success: true, data: deployment });
  } catch (error) {
    next(error);
  }
}

export async function getDeployments(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await deployService.getDeployments(req.user!.userId, page);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
