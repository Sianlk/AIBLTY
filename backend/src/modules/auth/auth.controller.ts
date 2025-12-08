import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';
import { z } from 'zod';

const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    
    // Set refresh token as HTTP-only cookie for security
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth',
    });
    
    res.status(201).json({ 
      success: true, 
      data: {
        user: result.user,
        accessToken: result.accessToken,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body);
    
    // Set refresh token as HTTP-only cookie for security
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth',
    });
    
    res.json({ 
      success: true, 
      data: {
        user: result.user,
        accessToken: result.accessToken,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    // Try to get refresh token from cookie first, then body
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    
    const validation = refreshTokenSchema.safeParse({ refreshToken });
    if (!validation.success) {
      return res.status(400).json({ 
        success: false, 
        error: 'Refresh token is required' 
      });
    }
    
    const result = await authService.refreshToken(validation.data.refreshToken);
    
    // Set new refresh token as HTTP-only cookie (token rotation)
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/api/auth',
    });
    
    res.json({ 
      success: true, 
      data: {
        user: result.user,
        accessToken: result.accessToken,
      }
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  try {
    if (req.user?.userId) {
      await authService.logout(req.user.userId);
    }
    
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
    });
    
    res.json({ success: true, message: 'Logged out successfully' });
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

export async function revokeAllTokens(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.revokeAllUserTokens(req.user!.userId);
    
    // Clear the refresh token cookie
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api/auth',
    });
    
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}
