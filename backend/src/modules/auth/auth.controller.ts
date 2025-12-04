import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const accessToken = await authService.refreshToken(req.user!.userId);
    res.json({ success: true, data: { accessToken } });
  } catch (error) {
    next(error);
  }
}

export async function requestPasswordReset(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.requestPasswordReset(req.body.email);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
  try {
    const user = await authService.getMe(req.user!.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}
