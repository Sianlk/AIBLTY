import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { logger } from '../utils/logger';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    
    req.user = payload;
    next();
  } catch (error) {
    logger.warn('Auth middleware error:', error);
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
}

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, error: 'Admin access required' });
  }
  
  next();
}

export function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const payload = verifyToken(token);
      req.user = payload;
    }
    
    next();
  } catch {
    // Token invalid, but that's okay for optional auth
    next();
  }
}
