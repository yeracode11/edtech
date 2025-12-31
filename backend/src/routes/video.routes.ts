import { Router } from 'express';
import { VideoController } from '../controllers/videoController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const videoController = new VideoController();

// Получение видео по уроку
router.get('/lesson/:lessonId', authenticate, (req, res) => videoController.getVideoByLesson(req, res));

// Создание видео урока (только админ)
router.post('/', authenticate, requireAdmin, (req, res) => videoController.createVideoLesson(req, res));

// Обновление видео урока (только админ)
router.put('/lesson/:lessonId', authenticate, requireAdmin, (req, res) => videoController.updateVideoLesson(req, res));

// Удаление видео урока (только админ)
router.delete('/lesson/:lessonId', authenticate, requireAdmin, (req, res) => videoController.deleteVideoLesson(req, res));

// Генерация временного URL для просмотра
router.get('/lesson/:lessonId/signed-url', authenticate, (req, res) => videoController.generateSignedUrl(req, res));

// Получение всех загруженных видео (только админ)
router.get('/all', authenticate, requireAdmin, (req, res) => videoController.getUploadedVideos(req, res));

// Статистика по видео (только админ)
router.get('/lesson/:lessonId/stats', authenticate, requireAdmin, (req, res) => videoController.getVideoStats(req, res));

export default router;



