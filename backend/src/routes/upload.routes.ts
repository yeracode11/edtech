import { Router } from 'express';
import uploadController from '../controllers/uploadController';
import { authenticate, requireAdmin } from '../middlewares/auth';
import { uploadVideo } from '../middlewares/upload';

const router = Router();

// Загрузка видео (только для админов)
router.post(
  '/video',
  authenticate,
  requireAdmin,
  uploadVideo.single('video'),
  uploadController.uploadVideo
);

// Удаление видео (только для админов)
router.delete(
  '/video/:filename',
  authenticate,
  requireAdmin,
  uploadController.deleteVideo
);

export default router;

