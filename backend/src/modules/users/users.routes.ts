import { Router } from 'express';
import * as usersController from './users.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, usersController.getUser);
router.patch('/me', authMiddleware, usersController.updateUser);
router.post('/me/password', authMiddleware, usersController.updatePassword);
router.delete('/me', authMiddleware, usersController.deleteUser);

export default router;
