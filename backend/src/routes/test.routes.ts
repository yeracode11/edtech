import { Router } from 'express';
import { TestController } from '../controllers/testController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const testController = new TestController();

// Получение теста по уроку
router.get('/lesson/:lessonId', authenticate, (req, res) => testController.getTestByLesson(req, res));

// Получение теста по ID
router.get('/:id', authenticate, (req, res) => testController.getTestById(req, res));

// Создание теста
router.post('/', authenticate, requireAdmin, (req, res) => testController.createTest(req, res));

// Обновление теста
router.put('/:id', authenticate, requireAdmin, (req, res) => testController.updateTest(req, res));

// Удаление теста
router.delete('/:id', authenticate, requireAdmin, (req, res) => testController.deleteTest(req, res));

// Вопросы
router.post('/questions', authenticate, requireAdmin, (req, res) => testController.createQuestion(req, res));
router.put('/questions/:id', authenticate, requireAdmin, (req, res) => testController.updateQuestion(req, res));
router.delete('/questions/:id', authenticate, requireAdmin, (req, res) => testController.deleteQuestion(req, res));

// Ответы
router.post('/answers', authenticate, requireAdmin, (req, res) => testController.createAnswer(req, res));
router.put('/answers/:id', authenticate, requireAdmin, (req, res) => testController.updateAnswer(req, res));
router.delete('/answers/:id', authenticate, requireAdmin, (req, res) => testController.deleteAnswer(req, res));

// Попытки прохождения
router.post('/attempts', authenticate, (req, res) => testController.submitTestAttempt(req, res));
router.get('/:testId/attempts/my', authenticate, (req, res) => testController.getUserAttempts(req, res));
router.get('/:testId/attempts/all', authenticate, requireAdmin, (req, res) => testController.getAllAttempts(req, res));

export default router;

