import { Router } from 'express';
import { EnrollmentController } from '../controllers/enrollmentController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const enrollmentController = new EnrollmentController();

// Получение всех записей (только админ)
router.get('/', authenticate, requireAdmin, (req, res) => enrollmentController.getAllEnrollments(req, res));

// Получение записей пользователя
router.get('/user/:userId', authenticate, requireAdmin, (req, res) => enrollmentController.getEnrollmentsByUser(req, res));

// Получение записей курса
router.get('/course/:courseId', authenticate, requireAdmin, (req, res) => enrollmentController.getEnrollmentsByCourse(req, res));

// Создание записи (предоставление доступа)
router.post('/', authenticate, requireAdmin, (req, res) => enrollmentController.createEnrollment(req, res));

// Обновление записи (продление доступа)
router.put('/:userId/:courseId', authenticate, requireAdmin, (req, res) => enrollmentController.updateEnrollment(req, res));

// Удаление записи (отзыв доступа)
router.delete('/:userId/:courseId', authenticate, requireAdmin, (req, res) => enrollmentController.deleteEnrollment(req, res));

// Проверка доступа
router.get('/check/:userId/:courseId', authenticate, (req, res) => enrollmentController.checkAccess(req, res));

// Истекающие доступы
router.get('/expiring', authenticate, requireAdmin, (req, res) => enrollmentController.getExpiringEnrollments(req, res));

export default router;



