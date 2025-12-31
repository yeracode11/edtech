import prisma from '../config/database';
import { PaymentStatus } from '@prisma/client';

export class PaymentService {
  async getAllPayments() {
    return prisma.payment.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPaymentById(id: string) {
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    if (!payment) {
      throw new Error('Платеж не найден');
    }

    return payment;
  }

  async getUserPayments(userId: string) {
    return prisma.payment.findMany({
      where: { userId },
      include: {
        course: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createPayment(data: {
    userId: string;
    courseId: string;
    amount: number;
    currency: string;
    paymentSystem: string;
  }) {
    // Проверяем существование пользователя и курса
    const user = await prisma.user.findUnique({
      where: { id: data.userId },
    });

    if (!user) {
      throw new Error('Пользователь не найден');
    }

    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new Error('Курс не найден');
    }

    // Создаем платеж
    const payment = await prisma.payment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        amount: data.amount,
        currency: data.currency,
        paymentSystem: data.paymentSystem,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        course: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });

    // TODO: Здесь будет интеграция с платежной системой (Kaspi, Halyk Bank и т.д.)
    // Возвращаем URL для оплаты
    
    return {
      payment,
      paymentUrl: `/payment/${payment.id}/checkout`, // Временная заглушка
    };
  }

  async updatePaymentStatus(
    id: string,
    status: PaymentStatus,
    transactionId?: string
  ) {
    const payment = await prisma.payment.update({
      where: { id },
      data: {
        status,
        transactionId,
      },
      include: {
        user: true,
        course: true,
      },
    });

    // Если платеж успешен, предоставляем доступ к курсу
    if (status === 'COMPLETED') {
      await this.grantCourseAccess(payment.userId, payment.courseId);
    }

    return payment;
  }

  async grantCourseAccess(userId: string, courseId: string, durationDays?: number) {
    // Проверяем, нет ли уже записи
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existing) {
      // Если уже есть запись, продлеваем срок
      if (durationDays) {
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + durationDays);

        return prisma.enrollment.update({
          where: {
            userId_courseId: { userId, courseId },
          },
          data: { expiresAt },
        });
      }
      return existing;
    }

    // Создаем новую запись
    const expiresAt = durationDays ? new Date() : null;
    if (expiresAt && durationDays) {
      expiresAt.setDate(expiresAt.getDate() + durationDays);
    }

    return prisma.enrollment.create({
      data: {
        userId,
        courseId,
        expiresAt,
      },
    });
  }

  async getPaymentStats() {
    const totalPayments = await prisma.payment.count();
    const completedPayments = await prisma.payment.count({
      where: { status: 'COMPLETED' },
    });
    const pendingPayments = await prisma.payment.count({
      where: { status: 'PENDING' },
    });
    const failedPayments = await prisma.payment.count({
      where: { status: 'FAILED' },
    });

    const totalRevenue = await prisma.payment.aggregate({
      where: { status: 'COMPLETED' },
      _sum: { amount: true },
    });

    const recentPayments = await prisma.payment.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            email: true,
          },
        },
        course: {
          select: {
            title: true,
          },
        },
      },
    });

    return {
      totalPayments,
      completedPayments,
      pendingPayments,
      failedPayments,
      totalRevenue: totalRevenue._sum.amount || 0,
      recentPayments,
    };
  }

  // Webhook для обработки колбеков от платежной системы
  async processWebhook(data: {
    paymentId: string;
    status: string;
    transactionId?: string;
  }) {
    const payment = await prisma.payment.findUnique({
      where: { id: data.paymentId },
    });

    if (!payment) {
      throw new Error('Платеж не найден');
    }

    // Маппинг статусов платежной системы на наши статусы
    let status: PaymentStatus = 'PENDING';
    if (data.status === 'success' || data.status === 'completed') {
      status = 'COMPLETED';
    } else if (data.status === 'failed' || data.status === 'error') {
      status = 'FAILED';
    }

    return this.updatePaymentStatus(payment.id, status, data.transactionId);
  }
}



