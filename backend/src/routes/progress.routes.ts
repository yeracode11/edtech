import { Router } from 'express';
import { ProgressController } from '../controllers/progressController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const progressController = new ProgressController();

// Получение прогресса пользователя по курсу
router.get('/course/:courseId', authenticate, (req, res) => progressController.getUserProgress(req, res));

// Отметить урок как пройденный
router.post('/lesson/:lessonId/complete', authenticate, (req, res) => progressController.markLessonComplete(req, res));

// Обновить время просмотра
router.post('/lesson/:lessonId/watch', authenticate, (req, res) => progressController.updateWatchTime(req, res));

// Статистика пользователя
router.get('/stats/me', authenticate, (req, res) => progressController.getUserStats(req, res));

// Статистика курса (только админ)
router.get('/stats/course/:courseId', authenticate, requireAdmin, (req, res) => progressController.getCourseStats(req, res));

// Последняя активность
router.get('/activity/recent', authenticate, (req, res) => progressController.getRecentActivity(req, res));

export default router;

