import { Request, Response, NextFunction } from 'express';
import * as usersService from './users.service';

export async function getUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.getUser(req.user!.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updateUser(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await usersService.updateUser(req.user!.userId, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

export async function updatePassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await usersService.updatePassword(req.user!.userId, currentPassword, newPassword);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await usersService.deleteUser(req.user!.userId);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
