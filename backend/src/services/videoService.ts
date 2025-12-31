import prisma from '../config/database';

// Этот сервис будет работать с Google Cloud Storage
// Пока создаем базовую структуру, интеграция с GCS будет позже

export class VideoService {
  async getVideoByLesson(lessonId: string) {
    const videoLesson = await prisma.videoLesson.findUnique({
      where: { lessonId },
    });

    if (!videoLesson) {
      throw new Error('Видео не найдено');
    }

    return videoLesson;
  }

  async createVideoLesson(data: {
    lessonId: string;
    videoUrl: string;
    duration: number;
    thumbnailUrl?: string;
  }) {
    // Проверяем существование урока
    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
    });

    if (!lesson) {
      throw new Error('Урок не найден');
    }

    // Проверяем, нет ли уже видео для этого урока
    const existing = await prisma.videoLesson.findUnique({
      where: { lessonId: data.lessonId },
    });

    if (existing) {
      throw new Error('Видео для этого урока уже существует');
    }

    return prisma.videoLesson.create({
      data: {
        lessonId: data.lessonId,
        videoUrl: data.videoUrl,
        duration: data.duration,
        thumbnailUrl: data.thumbnailUrl,
      },
    });
  }

  async updateVideoLesson(
    lessonId: string,
    data: {
      videoUrl?: string;
      duration?: number;
      thumbnailUrl?: string;
    }
  ) {
    return prisma.videoLesson.update({
      where: { lessonId },
      data,
    });
  }

  async deleteVideoLesson(lessonId: string) {
    return prisma.videoLesson.delete({
      where: { lessonId },
    });
  }

  // Генерация временного URL для просмотра (для защиты контента)
  // В будущем здесь будет генерация Signed URL от Google Cloud Storage
  async generateSignedUrl(lessonId: string, userId: string): Promise<string> {
    // Проверяем доступ пользователя к курсу
    const videoLesson = await prisma.videoLesson.findUnique({
      where: { lessonId },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!videoLesson) {
      throw new Error('Видео не найдено');
    }

    // Проверяем enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: videoLesson.lesson.courseId,
        },
      },
    });

    if (!enrollment) {
      throw new Error('Нет доступа к этому курсу');
    }

    // Проверяем срок действия
    if (enrollment.expiresAt && enrollment.expiresAt < new Date()) {
      throw new Error('Доступ к курсу истек');
    }

    // Пока возвращаем прямой URL
    // TODO: Интегрировать с Google Cloud Storage для генерации временных URL
    return videoLesson.videoUrl;
  }

  // Получение информации о загруженных видео
  async getUploadedVideos() {
    const videos = await prisma.videoLesson.findMany({
      include: {
        lesson: {
          include: {
            course: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return videos;
  }

  // Статистика по видео
  async getVideoStats(lessonId: string) {
    const videoLesson = await prisma.videoLesson.findUnique({
      where: { lessonId },
    });

    if (!videoLesson) {
      throw new Error('Видео не найдено');
    }

    // Считаем количество просмотров
    const viewCount = await prisma.lessonProgress.count({
      where: { lessonId },
    });

    // Считаем количество завершивших
    const completedCount = await prisma.lessonProgress.count({
      where: { lessonId, completed: true },
    });

    return {
      videoLesson,
      viewCount,
      completedCount,
      completionRate: viewCount > 0 ? Math.round((completedCount / viewCount) * 100) : 0,
    };
  }
}



