import { Request, Response, NextFunction } from 'express';
import * as adminService from './admin.service';

export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await adminService.getAllUsers(page);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getStats(req: Request, res: Response, next: NextFunction) {
  try {
    const stats = await adminService.getStats();
    res.json({ success: true, data: stats });
  } catch (error) {
    next(error);
  }
}

export async function getAllPayments(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await adminService.getAllPayments(page);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getAllDeployments(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const result = await adminService.getAllDeployments(page);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const { role } = req.body;
    const user = await adminService.updateUserRole(req.params.userId, role);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUserPlan(req: Request, res: Response, next: NextFunction) {
  try {
    const { plan } = req.body;
    const user = await adminService.updateUserPlan(req.params.userId, plan);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function getSetting(req: Request, res: Response, next: NextFunction) {
  try {
    const value = await adminService.getSetting(req.params.key);
    res.json({ success: true, data: value });
  } catch (error) {
    next(error);
  }
}

export async function updateSetting(req: Request, res: Response, next: NextFunction) {
  try {
    const setting = await adminService.updateSetting(req.params.key, req.body.value);
    res.json({ success: true, data: setting });
  } catch (error) {
    next(error);
  }
}
