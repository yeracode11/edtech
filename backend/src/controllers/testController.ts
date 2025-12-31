import { Request, Response } from 'express';
import { TestService } from '../services/testService';

const testService = new TestService();

export class TestController {
  async getTestByLesson(req: Request, res: Response) {
    try {
      const { lessonId } = req.params;
      const test = await testService.getTestByLesson(lessonId);
      res.json({ test });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getTestById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const test = await testService.getTestById(id);
      res.json({ test });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createTest(req: Request, res: Response) {
    try {
      const { lessonId, title, description, passingScore, timeLimit } = req.body;

      if (!lessonId || !title || passingScore === undefined) {
        return res.status(400).json({ error: 'lessonId, title и passingScore обязательны' });
      }

      const test = await testService.createTest({
        lessonId,
        title,
        description,
        passingScore,
        timeLimit,
      });

      res.status(201).json({ test });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateTest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, passingScore, timeLimit } = req.body;

      const test = await testService.updateTest(id, {
        title,
        description,
        passingScore,
        timeLimit,
      });

      res.json({ test });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteTest(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await testService.deleteTest(id);
      res.json({ message: 'Тест удален' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Вопросы
  async createQuestion(req: Request, res: Response) {
    try {
      const { testId, text, type, order, points } = req.body;

      if (!testId || !text || !type || points === undefined) {
        return res.status(400).json({ error: 'testId, text, type и points обязательны' });
      }

      const question = await testService.createQuestion({
        testId,
        text,
        type,
        order: order || 0,
        points,
      });

      res.status(201).json({ question });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text, type, order, points } = req.body;

      const question = await testService.updateQuestion(id, {
        text,
        type,
        order,
        points,
      });

      res.json({ question });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteQuestion(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await testService.deleteQuestion(id);
      res.json({ message: 'Вопрос удален' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Ответы
  async createAnswer(req: Request, res: Response) {
    try {
      const { questionId, text, isCorrect, order } = req.body;

      if (!questionId || !text || isCorrect === undefined) {
        return res.status(400).json({ error: 'questionId, text и isCorrect обязательны' });
      }

      const answer = await testService.createAnswer({
        questionId,
        text,
        isCorrect,
        order: order || 0,
      });

      res.status(201).json({ answer });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateAnswer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { text, isCorrect, order } = req.body;

      const answer = await testService.updateAnswer(id, {
        text,
        isCorrect,
        order,
      });

      res.json({ answer });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteAnswer(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await testService.deleteAnswer(id);
      res.json({ message: 'Ответ удален' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // Попытки прохождения
  async submitTestAttempt(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { testId, answers } = req.body;

      if (!testId || !answers) {
        return res.status(400).json({ error: 'testId и answers обязательны' });
      }

      const attempt = await testService.submitTestAttempt({
        userId: req.user.userId,
        testId,
        answers,
      });

      res.status(201).json({ attempt });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserAttempts(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const { testId } = req.params;
      const attempts = await testService.getUserAttempts(req.user.userId, testId);
      res.json({ attempts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getAllAttempts(req: Request, res: Response) {
    try {
      const { testId } = req.params;
      const attempts = await testService.getAllAttempts(testId);
      res.json({ attempts });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}



