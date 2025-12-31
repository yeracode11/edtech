import { Request, Response } from 'express';
import { VideoService } from '../services/videoService';

const videoService = new VideoService();

export class VideoController {
  async getVideoByLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const video = await videoService.getVideoByLesson(lessonId);
      res.json({ video });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createVideoLesson(req: Request, res: Response) {
    try {
      const { lessonId, videoUrl, duration, thumbnailUrl } = req.body;

      if (!lessonId || !videoUrl || !duration) {
        return res.status(400).json({ error: 'lessonId, videoUrl и duration обязательны' });
      }

      const video = await videoService.createVideoLesson({
        lessonId,
        videoUrl,
        duration: parseInt(duration),
        thumbnailUrl,
      });

      res.status(201).json({ video });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateVideoLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const { videoUrl, duration, thumbnailUrl } = req.body;

      const video = await videoService.updateVideoLesson(lessonId, {
        videoUrl,
        duration: duration ? parseInt(duration) : undefined,
        thumbnailUrl,
      });

      res.json({ video });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteVideoLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      await videoService.deleteVideoLesson(lessonId);
      res.json({ message: 'Видео удалено' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async generateSignedUrl(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { lessonId } = req.params;
      const signedUrl = await videoService.generateSignedUrl(lessonId, req.user.userId);
      res.json({ url: signedUrl });
    } catch (error: any) {
      res.status(403).json({ error: error.message });
    }
  }

  async getUploadedVideos(req: Request, res: Response) {
    try {
      const videos = await videoService.getUploadedVideos();
      res.json({ videos });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getVideoStats(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const stats = await videoService.getVideoStats(lessonId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}



