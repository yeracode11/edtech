import prisma from '../config/database';

export class ProgressService {
  async getUserProgress(userId: string, courseId: string) {
    const enrollments = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollments) {
      throw new Error('Пользователь не записан на этот курс');
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        lessons: {
          where: { isPublished: true },
          orderBy: { order: 'asc' },
          include: {
            progress: {
              where: { userId },
            },
            test: {
              include: {
                attempts: {
                  where: { userId },
                  orderBy: { createdAt: 'desc' },
                  take: 1,
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
      throw new Error('Курс не найден');
    }

    const totalLessons = course.lessons.length;
    const completedLessons = course.lessons.filter(
      (lesson) => lesson.progress.length > 0 && lesson.progress[0].completed
    ).length;

    const progressPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      course,
      totalLessons,
      completedLessons,
      progressPercentage,
      lessons: course.lessons.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        order: lesson.order,
        completed: lesson.progress.length > 0 ? lesson.progress[0].completed : false,
        lastWatchedAt: lesson.progress.length > 0 ? lesson.progress[0].lastWatchedAt : null,
        testPassed:
          lesson.test && lesson.test.attempts.length > 0 ? lesson.test.attempts[0].passed : null,
      })),
    };
  }

  async markLessonComplete(userId: string, lessonId: string) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error('Урок не найден');
    }

    // Проверяем доступ к курсу
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId: lesson.courseId },
      },
    });

    if (!enrollment) {
      throw new Error('Нет доступа к этому курсу');
    }

    // Создаем или обновляем прогресс
    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        completed: true,
        lastWatchedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: true,
        lastWatchedAt: new Date(),
      },
    });

    return progress;
  }

  async updateWatchTime(userId: string, lessonId: string, watchedDuration: number) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
    });

    if (!lesson) {
      throw new Error('Урок не найден');
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        lastWatchedAt: new Date(),
      },
      create: {
        userId,
        lessonId,
        completed: false,
        lastWatchedAt: new Date(),
      },
    });

    return progress;
  }

  async getUserStats(userId: string) {
    const enrollments = await prisma.enrollment.count({
      where: { userId },
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: { userId, completed: true },
    });

    const testAttempts = await prisma.testAttempt.count({
      where: { userId },
    });

    const passedTests = await prisma.testAttempt.count({
      where: { userId, passed: true },
    });

    return {
      enrolledCourses: enrollments,
      completedLessons,
      testAttempts,
      passedTests,
    };
  }

  async getCourseStats(courseId: string) {
    const enrollments = await prisma.enrollment.count({
      where: { courseId },
    });

    const lessons = await prisma.lesson.findMany({
      where: { courseId, isPublished: true },
      include: {
        progress: true,
      },
    });

    const totalLessons = lessons.length;
    const totalProgress = lessons.reduce((sum, lesson) => sum + lesson.progress.length, 0);

    const completionRate =
      enrollments > 0 && totalLessons > 0
        ? Math.round((totalProgress / (enrollments * totalLessons)) * 100)
        : 0;

    return {
      totalEnrollments: enrollments,
      totalLessons,
      completionRate,
    };
  }

  async getRecentActivity(userId: string, limit: number = 10) {
    const recentProgress = await prisma.lessonProgress.findMany({
      where: { userId },
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
      orderBy: { lastWatchedAt: 'desc' },
      take: limit,
    });

    return recentProgress;
  }
}



