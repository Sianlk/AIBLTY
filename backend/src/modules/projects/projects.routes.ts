import { Router } from 'express';
import * as projectsController from './projects.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.post('/', projectsController.createProject);
router.get('/', projectsController.getProjects);
router.get('/:id', projectsController.getProject);
router.patch('/:id', projectsController.updateProject);
router.delete('/:id', projectsController.deleteProject);

export default router;
