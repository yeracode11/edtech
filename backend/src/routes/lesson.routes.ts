import { Router } from 'express';
import { LessonController } from '../controllers/lessonController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const lessonController = new LessonController();

// Получение уроков курса
router.get('/course/:courseId', authenticate, (req, res) => lessonController.getLessonsByCourse(req, res));

// Получение урока по ID
router.get('/:id', authenticate, (req, res) => lessonController.getLessonById(req, res));

// Создание урока
router.post('/', authenticate, requireAdmin, (req, res) => lessonController.createLesson(req, res));

// Обновление урока
router.put('/:id', authenticate, requireAdmin, (req, res) => lessonController.updateLesson(req, res));

// Удаление урока
router.delete('/:id', authenticate, requireAdmin, (req, res) => lessonController.deleteLesson(req, res));

// Изменение порядка уроков
router.post('/course/:courseId/reorder', authenticate, requireAdmin, (req, res) => lessonController.reorderLessons(req, res));

// Создание видео урока
router.post('/video', authenticate, requireAdmin, (req, res) => lessonController.createVideoLesson(req, res));

// Обновление видео урока
router.put('/video/:lessonId', authenticate, requireAdmin, (req, res) => lessonController.updateVideoLesson(req, res));

export default router;

