import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const userController = new UserController();

// Получение всех пользователей (только админ)
router.get('/', authenticate, requireAdmin, (req, res) => userController.getAllUsers(req, res));

// Получение пользователя по ID (только админ)
router.get('/:id', authenticate, requireAdmin, (req, res) => userController.getUserById(req, res));

// Обновление роли пользователя (только админ)
router.put('/:id/role', authenticate, requireAdmin, (req, res) => userController.updateUserRole(req, res));

// Обновление профиля пользователя (только админ)
router.put('/:id', authenticate, requireAdmin, (req, res) => userController.updateUserProfile(req, res));

// Удаление пользователя (только админ)
router.delete('/:id', authenticate, requireAdmin, (req, res) => userController.deleteUser(req, res));

// Статистика пользователей (только админ)
router.get('/stats/overview', authenticate, requireAdmin, (req, res) => userController.getUserStats(req, res));

export default router;



