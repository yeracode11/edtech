import { Request, Response } from 'express';
import { ProgressService } from '../services/progressService';

const progressService = new ProgressService();

export class ProgressController {
  async getUserProgress(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { courseId } = req.params;
      const progress = await progressService.getUserProgress(req.user.userId, courseId);
      res.json(progress);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async markLessonComplete(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { lessonId } = req.params;
      const progress = await progressService.markLessonComplete(req.user.userId, lessonId);
      res.json({ progress, message: 'Урок отмечен как пройденный' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateWatchTime(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { lessonId } = req.params;
      const { watchedDuration } = req.body;

      const progress = await progressService.updateWatchTime(
        req.user.userId,
        lessonId,
        watchedDuration
      );

      res.json({ progress });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserStats(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const stats = await progressService.getUserStats(req.user.userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCourseStats(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const stats = await progressService.getCourseStats(courseId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getRecentActivity(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activity = await progressService.getRecentActivity(req.user.userId, limit);
      res.json({ activity });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}



