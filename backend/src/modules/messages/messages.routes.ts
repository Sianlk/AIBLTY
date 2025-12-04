import { Router } from 'express';
import * as messagesController from './messages.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/session/:sessionId', messagesController.createMessage);
router.get('/session/:sessionId', messagesController.getMessages);

export default router;
