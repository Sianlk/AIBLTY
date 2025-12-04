import { Router } from 'express';
import multer from 'multer';
import * as filesController from './files.controller';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
});

router.use(authMiddleware);

router.post('/upload', upload.single('file'), filesController.uploadFile);
router.get('/', filesController.listFiles);
router.get('/:id', filesController.getFile);
router.delete('/:id', filesController.deleteFile);

export default router;
