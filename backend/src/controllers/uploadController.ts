import { Request, Response } from 'express';
import path from 'path';

class UploadController {
  // Загрузка видео
  async uploadVideo(req: Request, res: Response) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'Файл не загружен' });
      }

      // Возвращаем URL загруженного видео
      const videoUrl = `/uploads/videos/${req.file.filename}`;

      res.status(200).json({
        message: 'Видео успешно загружено',
        videoUrl,
        filename: req.file.filename,
        size: req.file.size,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  // Удаление видео
  async deleteVideo(req: Request, res: Response) {
    try {
      const { filename } = req.params;
      const fs = require('fs');
      const filePath = path.join(__dirname, '../../uploads/videos', filename);

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.json({ message: 'Видео удалено' });
      } else {
        res.status(404).json({ error: 'Файл не найден' });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new UploadController();

