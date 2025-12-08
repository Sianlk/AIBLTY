import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../config/db';
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

/**
 * Admin middleware with database verification
 * Always checks current role from database, not just JWT
 */
export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  
  try {
    // Always verify current role from database for admin operations
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true },
    });
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }
    
    // Update req.user with current role from database
    req.user.role = user.role;
    next();
  } catch (error) {
    logger.error('Admin middleware database error:', error);
    return res.status(500).json({ success: false, error: 'Authorization check failed' });
  }
}

/**
 * Middleware that verifies user exists and updates JWT claims with current DB values
 * Use for sensitive operations that need current role/plan
 */
export async function freshClaimsMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return res.status(401).json({ success: false, error: 'Authentication required' });
  }
  
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { role: true, plan: true, email: true },
    });
    
    if (!user) {
      return res.status(401).json({ success: false, error: 'User not found' });
    }
    
    // Update req.user with current values from database
    req.user.role = user.role;
    req.user.plan = user.plan;
    req.user.email = user.email;
    
    next();
  } catch (error) {
    logger.error('Fresh claims middleware error:', error);
    return res.status(500).json({ success: false, error: 'Authorization check failed' });
  }
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
