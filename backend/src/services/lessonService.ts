import prisma from '../config/database';

export class LessonService {
  async getLessonsByCourse(courseId: string) {
    return prisma.lesson.findMany({
      where: { courseId },
      include: {
        videoLesson: true,
        test: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async getLessonById(id: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id },
      include: {
        videoLesson: true,
        test: {
          include: {
            questions: {
              include: {
                answers: true,
              },
            },
          },
        },
        course: true,
      },
    });

    if (!lesson) {
      throw new Error('Урок не найден');
    }

    return lesson;
  }

  async createLesson(data: {
    title: string;
    description?: string;
    courseId: string;
    type: 'VIDEO' | 'TEXT' | 'QUIZ';
    order: number;
    isPublished?: boolean;
    content?: string;
    videoUrl?: string;
    duration?: number;
  }) {
    // Проверяем существование курса
    const course = await prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) {
      throw new Error('Курс не найден');
    }

    return prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        courseId: data.courseId,
        type: data.type,
        order: data.order,
        isPublished: data.isPublished || false,
        content: data.content,
        videoUrl: data.videoUrl,
        duration: data.duration,
      },
      include: {
        videoLesson: true,
        test: true,
      },
    });
  }

  async updateLesson(
    id: string,
    data: {
      title?: string;
      description?: string;
      type?: 'VIDEO' | 'TEXT' | 'QUIZ';
      order?: number;
      isPublished?: boolean;
      content?: string;
      videoUrl?: string;
      duration?: number;
    }
  ) {
    return prisma.lesson.update({
      where: { id },
      data,
      include: {
        videoLesson: true,
        test: true,
      },
    });
  }

  async deleteLesson(id: string) {
    return prisma.lesson.delete({
      where: { id },
    });
  }

  async reorderLessons(courseId: string, lessonOrders: { id: string; order: number }[]) {
    // Обновляем порядок уроков транзакцией
    return prisma.$transaction(
      lessonOrders.map((lesson) =>
        prisma.lesson.update({
          where: { id: lesson.id },
          data: { order: lesson.order },
        })
      )
    );
  }

  async createVideoLesson(data: {
    lessonId: string;
    videoUrl: string;
    duration: number;
    thumbnailUrl?: string;
  }) {
    return prisma.videoLesson.create({
      data,
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
}



