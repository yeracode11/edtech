import { Router } from 'express';
import { PaymentController } from '../controllers/paymentController';
import { authenticate, requireAdmin } from '../middlewares/auth';

const router = Router();
const paymentController = new PaymentController();

// Получение всех платежей (только админ)
router.get('/all', authenticate, requireAdmin, (req, res) => paymentController.getAllPayments(req, res));

// Получение платежа по ID (только админ)
router.get('/:id', authenticate, requireAdmin, (req, res) => paymentController.getPaymentById(req, res));

// Получение платежей пользователя
router.get('/my/history', authenticate, (req, res) => paymentController.getUserPayments(req, res));

// Создание платежа
router.post('/create', authenticate, (req, res) => paymentController.createPayment(req, res));

// Обновление статуса платежа (только админ)
router.put('/:id/status', authenticate, requireAdmin, (req, res) => paymentController.updatePaymentStatus(req, res));

// Ручное предоставление доступа (только админ)
router.post('/grant-access', authenticate, requireAdmin, (req, res) => paymentController.grantAccess(req, res));

// Статистика платежей (только админ)
router.get('/stats/overview', authenticate, requireAdmin, (req, res) => paymentController.getPaymentStats(req, res));

// Webhook для обработки колбеков от платежной системы
router.post('/webhook', (req, res) => paymentController.processWebhook(req, res));

export default router;

