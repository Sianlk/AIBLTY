import { Router } from 'express';
import * as aiController from './ai.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/solve', aiController.solveProblem);
router.post('/build', aiController.buildBusiness);
router.post('/automate', aiController.runAutomation);
router.post('/chat', aiController.chat);

export default router;
