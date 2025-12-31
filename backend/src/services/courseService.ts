import prisma from '../config/database';

export class CourseService {
  async getAllCourses(includeUnpublished = false) {
    const where = includeUnpublished ? {} : { isPublished: true };
    
    return prisma.course.findMany({
      where,
      include: {
        lessons: {
          where: includeUnpublished ? {} : { isPublished: true },
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCourseById(id: string, includeUnpublished = false) {
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        lessons: {
          where: includeUnpublished ? {} : { isPublished: true },
          orderBy: { order: 'asc' },
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
        },
      },
    });

    if (!course || (!includeUnpublished && !course.isPublished)) {
      throw new Error('Курс не найден');
    }

    return course;
  }

  async createCourse(data: {
    title: string;
    description?: string;
    thumbnail?: string;
    price: number;
    priceInstallment?: number;
    isPublished?: boolean;
  }) {
    return prisma.course.create({
      data,
    });
  }

  async updateCourse(
    id: string,
    data: {
      title?: string;
      description?: string;
      thumbnail?: string;
      price?: number;
      priceInstallment?: number;
      isPublished?: boolean;
    }
  ) {
    return prisma.course.update({
      where: { id },
      data,
    });
  }

  async deleteCourse(id: string) {
    return prisma.course.delete({
      where: { id },
    });
  }

  async getUserCourses(userId: string) {
    const enrollments = await prisma.enrollment.findMany({
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
    });

    return enrollments.map((e) => e.course);
  }

  async checkUserAccess(userId: string, courseId: string): Promise<boolean> {
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (!enrollment) return false;
    if (!enrollment.expiresAt) return true;
    return enrollment.expiresAt > new Date();
  }
}



