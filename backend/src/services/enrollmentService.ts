import prisma from '../config/database';

export class EnrollmentService {
  async getAllEnrollments() {
    return prisma.enrollment.findMany({
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
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getEnrollmentsByUser(userId: string) {
    return prisma.enrollment.findMany({
      where: { userId },
      include: {
        course: {
          include: {
            lessons: {
              where: { isPublished: true },
              orderBy: { order: 'asc' },
            },
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async getEnrollmentsByCourse(courseId: string) {
    return prisma.enrollment.findMany({
      where: { courseId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { enrolledAt: 'desc' },
    });
  }

  async createEnrollment(data: {
    userId: string;
    courseId: string;
    expiresAt?: Date;
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

    // Проверяем, нет ли уже записи
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: data.userId,
          courseId: data.courseId,
        },
      },
    });

    if (existing) {
      throw new Error('Пользователь уже записан на этот курс');
    }

    return prisma.enrollment.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        expiresAt: data.expiresAt,
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
  }

  async updateEnrollment(
    userId: string,
    courseId: string,
    data: {
      expiresAt?: Date | null;
    }
  ) {
    return prisma.enrollment.update({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
      data: {
        expiresAt: data.expiresAt,
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
  }

  async deleteEnrollment(userId: string, courseId: string) {
    return prisma.enrollment.delete({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });
  }

  async checkAccess(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (!enrollment) return false;
    if (!enrollment.expiresAt) return true;
    return enrollment.expiresAt > new Date();
  }

  async getExpiringEnrollments(days: number = 7) {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return prisma.enrollment.findMany({
      where: {
        expiresAt: {
          lte: futureDate,
          gte: new Date(),
        },
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
      orderBy: { expiresAt: 'asc' },
    });
  }
}



