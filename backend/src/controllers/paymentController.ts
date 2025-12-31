import { Request, Response } from 'express';
import { PaymentService } from '../services/paymentService';
import { PaymentStatus } from '@prisma/client';

const paymentService = new PaymentService();

export class PaymentController {
  async getAllPayments(req: Request, res: Response) {
    try {
      const payments = await paymentService.getAllPayments();
      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getPaymentById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const payment = await paymentService.getPaymentById(id);
      res.json({ payment });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async getUserPayments(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const payments = await paymentService.getUserPayments(req.user.userId);
      res.json({ payments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createPayment(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { courseId, paymentSystem } = req.body;

      if (!courseId || !paymentSystem) {
        return res.status(400).json({ error: 'courseId и paymentSystem обязательны' });
      }

      // Получаем цену курса
      const course = await paymentService['prisma'].course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        return res.status(404).json({ error: 'Курс не найден' });
      }

      const result = await paymentService.createPayment({
        userId: req.user.userId,
        courseId,
        amount: course.price,
        currency: 'KZT',
        paymentSystem,
      });

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updatePaymentStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status, transactionId } = req.body;

      if (!status) {
        return res.status(400).json({ error: 'status обязателен' });
      }

      const payment = await paymentService.updatePaymentStatus(
        id,
        status as PaymentStatus,
        transactionId
      );

      res.json({ payment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async grantAccess(req: Request, res: Response) {
    try {
      const { userId, courseId, durationDays } = req.body;

      if (!userId || !courseId) {
        return res.status(400).json({ error: 'userId и courseId обязательны' });
      }

      const enrollment = await paymentService.grantCourseAccess(
        userId,
        courseId,
        durationDays ? parseInt(durationDays) : undefined
      );

      res.json({ enrollment, message: 'Доступ предоставлен' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getPaymentStats(req: Request, res: Response) {
    try {
      const stats = await paymentService.getPaymentStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async processWebhook(req: Request, res: Response) {
    try {
      const { paymentId, status, transactionId } = req.body;

      if (!paymentId || !status) {
        return res.status(400).json({ error: 'paymentId и status обязательны' });
      }

      const payment = await paymentService.processWebhook({
        paymentId,
        status,
        transactionId,
      });

      res.json({ payment, message: 'Webhook обработан' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}



