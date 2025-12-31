import prisma from '../config/database';

export class TestService {
  async getTestByLesson(lessonId: string) {
    return prisma.test.findUnique({
      where: { lessonId },
      include: {
        questions: {
          include: {
            answers: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });
  }

  async getTestById(id: string) {
    const test = await prisma.test.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            answers: true,
          },
          orderBy: { order: 'asc' },
        },
        lesson: true,
      },
    });

    if (!test) {
      throw new Error('Тест не найден');
    }

    return test;
  }

  async createTest(data: {
    lessonId: string;
    title: string;
    description?: string;
    passingScore: number;
    timeLimit?: number;
  }) {
    // Проверяем существование урока
    const lesson = await prisma.lesson.findUnique({
      where: { id: data.lessonId },
    });

    if (!lesson) {
      throw new Error('Урок не найден');
    }

    return prisma.test.create({
      data: {
        lessonId: data.lessonId,
        title: data.title,
        description: data.description,
        passingScore: data.passingScore,
        timeLimit: data.timeLimit,
      },
      include: {
        questions: true,
      },
    });
  }

  async updateTest(
    id: string,
    data: {
      title?: string;
      description?: string;
      passingScore?: number;
      timeLimit?: number;
    }
  ) {
    return prisma.test.update({
      where: { id },
      data,
      include: {
        questions: {
          include: {
            answers: true,
          },
        },
      },
    });
  }

  async deleteTest(id: string) {
    return prisma.test.delete({
      where: { id },
    });
  }

  // Управление вопросами
  async createQuestion(data: {
    testId: string;
    text: string;
    type: 'SINGLE' | 'MULTIPLE';
    order: number;
    points: number;
  }) {
    return prisma.question.create({
      data,
      include: {
        answers: true,
      },
    });
  }

  async updateQuestion(
    id: string,
    data: {
      text?: string;
      type?: 'SINGLE' | 'MULTIPLE';
      order?: number;
      points?: number;
    }
  ) {
    return prisma.question.update({
      where: { id },
      data,
      include: {
        answers: true,
      },
    });
  }

  async deleteQuestion(id: string) {
    return prisma.question.delete({
      where: { id },
    });
  }

  // Управление ответами
  async createAnswer(data: {
    questionId: string;
    text: string;
    isCorrect: boolean;
    order: number;
  }) {
    return prisma.answer.create({
      data,
    });
  }

  async updateAnswer(
    id: string,
    data: {
      text?: string;
      isCorrect?: boolean;
      order?: number;
    }
  ) {
    return prisma.answer.update({
      where: { id },
      data,
    });
  }

  async deleteAnswer(id: string) {
    return prisma.answer.delete({
      where: { id },
    });
  }

  // Проверка ответов пользователя
  async submitTestAttempt(data: {
    userId: string;
    testId: string;
    answers: { questionId: string; answerIds: string[] }[];
  }) {
    const test = await this.getTestById(data.testId);
    let score = 0;
    let maxScore = 0;

    // Подсчитываем баллы
    for (const question of test.questions) {
      maxScore += question.points;
      const userAnswer = data.answers.find((a) => a.questionId === question.id);

      if (userAnswer) {
        const correctAnswers = question.answers
          .filter((a) => a.isCorrect)
          .map((a) => a.id)
          .sort();

        const userAnswerIds = userAnswer.answerIds.sort();

        // Проверяем правильность ответа
        if (JSON.stringify(correctAnswers) === JSON.stringify(userAnswerIds)) {
          score += question.points;
        }
      }
    }

    const passed = score >= test.passingScore;

    // Сохраняем попытку
    return prisma.testAttempt.create({
      data: {
        userId: data.userId,
        testId: data.testId,
        score,
        maxScore,
        passed,
        answers: data.answers,
      },
    });
  }

  async getUserAttempts(userId: string, testId: string) {
    return prisma.testAttempt.findMany({
      where: {
        userId,
        testId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllAttempts(testId: string) {
    return prisma.testAttempt.findMany({
      where: { testId },
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
      orderBy: { createdAt: 'desc' },
    });
  }
}



