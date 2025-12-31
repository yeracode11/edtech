import { Request, Response } from 'express';
import { CourseService } from '../services/courseService';

const courseService = new CourseService();

export class CourseController {
  async getAllCourses(req: Request, res: Response) {
    try {
      const includeUnpublished = req.user?.role === 'ADMIN';
      const courses = await courseService.getAllCourses(includeUnpublished);
      res.json({ courses });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getCourseById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const includeUnpublished = req.user?.role === 'ADMIN';
      const course = await courseService.getCourseById(id, includeUnpublished);
      res.json({ course });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async createCourse(req: Request, res: Response) {
    try {
      const { title, description, thumbnail, price, priceInstallment, isPublished } = req.body;

      if (!title || price === undefined) {
        return res.status(400).json({ error: 'Название и цена обязательны' });
      }

      const course = await courseService.createCourse({
        title,
        description,
        thumbnail,
        price: parseFloat(price),
        priceInstallment: priceInstallment ? parseFloat(priceInstallment) : undefined,
        isPublished,
      });

      res.status(201).json({ course });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { title, description, thumbnail, price, priceInstallment, isPublished } = req.body;

      const course = await courseService.updateCourse(id, {
        title,
        description,
        thumbnail,
        price: price ? parseFloat(price) : undefined,
        priceInstallment: priceInstallment ? parseFloat(priceInstallment) : undefined,
        isPublished,
      });

      res.json({ course });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteCourse(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await courseService.deleteCourse(id);
      res.json({ message: 'Курс удален' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserCourses(req: Request, res: Response) {
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Не авторизован' });
      }

      const courses = await courseService.getUserCourses(req.user.userId);
      res.json({ courses });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}



