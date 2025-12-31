import { Request, Response } from 'express';
import { LessonService } from '../services/lessonService';

const lessonService = new LessonService();

export class LessonController {
  async getLessonsByCourse(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const lessons = await lessonService.getLessonsByCourse(courseId);
      res.json({ lessons });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getLessonById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const lesson = await lessonService.getLessonById(id);
      res.json({ lesson });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createLesson(req: Request, res: Response) {
    try {
      const { title, description, courseId, type, order, isPublished, content, videoUrl, duration } = req.body;

      if (!title || !courseId || !type) {
        return res.status(400).json({ error: 'Название, курс и тип обязательны' });
      }

      const lesson = await lessonService.createLesson({
        title,
        description,
        courseId,
        type,
        order: order || 0,
        isPublished,
        content,
        videoUrl,
        duration,
      });

      res.status(201).json({ lesson });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, order, isPublished, content, videoUrl, duration } = req.body;

      const lesson = await lessonService.updateLesson(id, {
        title,
        description,
        order,
        isPublished,
        content,
        videoUrl,
        duration,
      });

      res.json({ lesson });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteLesson(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await lessonService.deleteLesson(id);
      res.json({ message: 'Урок удален' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async reorderLessons(req: Request, res: Response) {
    try {
      const { courseId } = req.params;
      const { lessonOrders } = req.body;

      if (!Array.isArray(lessonOrders)) {
        return res.status(400).json({ error: 'lessonOrders должен быть массивом' });
      }

      await lessonService.reorderLessons(courseId, lessonOrders);
      res.json({ message: 'Порядок уроков обновлен' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async createVideoLesson(req: Request, res: Response) {
    try {
      const { lessonId, videoUrl, duration, thumbnailUrl } = req.body;

      if (!lessonId || !videoUrl || !duration) {
        return res.status(400).json({ error: 'lessonId, videoUrl и duration обязательны' });
      }

      const videoLesson = await lessonService.createVideoLesson({
        lessonId,
        videoUrl,
        duration,
        thumbnailUrl,
      });

      res.status(201).json({ videoLesson });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateVideoLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const { videoUrl, duration, thumbnailUrl } = req.body;

      const videoLesson = await lessonService.updateVideoLesson(lessonId, {
        videoUrl,
        duration,
        thumbnailUrl,
      });

      res.json({ videoLesson });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}



