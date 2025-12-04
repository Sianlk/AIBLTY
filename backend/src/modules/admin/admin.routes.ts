import { Router } from 'express';
import * as adminController from './admin.controller';
import { authMiddleware, adminMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware, adminMiddleware);

router.get('/users', adminController.getAllUsers);
router.get('/stats', adminController.getStats);
router.get('/payments', adminController.getAllPayments);
router.get('/deployments', adminController.getAllDeployments);

router.patch('/users/:userId/role', adminController.updateUserRole);
router.patch('/users/:userId/plan', adminController.updateUserPlan);

router.get('/settings/:key', adminController.getSetting);
router.put('/settings/:key', adminController.updateSetting);

export default router;
