import { Router } from 'express';
import * as sessionsController from './sessions.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/project/:projectId', sessionsController.createSession);
router.get('/project/:projectId', sessionsController.getSessions);
router.get('/:id', sessionsController.getSession);
router.delete('/:id', sessionsController.deleteSession);

export default router;
