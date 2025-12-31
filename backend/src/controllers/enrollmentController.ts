import { Request, Response } from 'express';
import { EnrollmentService } from '../services/enrollmentService';

const enrollmentService = new EnrollmentService();

export class EnrollmentController {
  async getAllEnrollments(req: Request, res: Response) {
    try {
      const enrollments = await enrollmentService.getAllEnrollments();
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEnrollmentsByUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const enrollments = await enrollmentService.getEnrollmentsByUser(userId);
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getEnrollmentsByCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const enrollments = await enrollmentService.getEnrollmentsByCourse(courseId);
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async createEnrollment(req: Request, res: Response) {
    try {
      const { userId, courseId, expiresAt } = req.body;

      if (!userId || !courseId) {
        return res.status(400).json({ error: 'userId и courseId обязательны' });
      }

      const enrollment = await enrollmentService.createEnrollment({
        userId,
        courseId,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      });

      res.status(201).json({ enrollment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateEnrollment(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.params;
      const { expiresAt } = req.body;

      const enrollment = await enrollmentService.updateEnrollment(userId, courseId, {
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      });

      res.json({ enrollment });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteEnrollment(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.params;
      await enrollmentService.deleteEnrollment(userId, courseId);
      res.json({ message: 'Доступ отозван' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async checkAccess(req: Request, res: Response) {
    try {
      const { userId, courseId } = req.params;
      const hasAccess = await enrollmentService.checkAccess(userId, courseId);
      res.json({ hasAccess });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getExpiringEnrollments(req: Request, res: Response) {
    try {
      const days = req.query.days ? parseInt(req.query.days as string) : 7;
      const enrollments = await enrollmentService.getExpiringEnrollments(days);
      res.json({ enrollments });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}



