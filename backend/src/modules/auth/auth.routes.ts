import { Router } from 'express';
import * as authController from './auth.controller';
import { authMiddleware, optionalAuth } from '../../middleware/auth';

const router = Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);

// Token refresh - accepts refresh token from cookie or body (no auth required)
router.post('/refresh', authController.refresh);

// Protected routes
router.get('/me', authMiddleware, authController.getMe);
router.post('/logout', authMiddleware, authController.logout);
router.post('/revoke-all', authMiddleware, authController.revokeAllTokens);

export default router;
