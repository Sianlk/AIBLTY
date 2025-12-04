import { Router } from 'express';
import * as deployController from './deploy.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/trigger', deployController.triggerDeployment);
router.get('/', deployController.getDeployments);
router.get('/:id', deployController.getDeployment);

export default router;
