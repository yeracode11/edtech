import { Request, Response } from 'express';
import { UserService } from '../services/userService';
import { Role } from '@prisma/client';

const userService = new UserService();

export class UserController {
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await userService.getAllUsers();
      res.json({ users });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);
      res.json({ user });
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  async updateUserRole(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { role } = req.body;

      if (!role || !['USER', 'ADMIN'].includes(role)) {
        return res.status(400).json({ error: 'Некорректная роль' });
      }

      const user = await userService.updateUserRole(id, role as Role);
      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateUserProfile(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { firstName, lastName, email } = req.body;

      const user = await userService.updateUserProfile(id, {
        firstName,
        lastName,
        email,
      });

      res.json({ user });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      await userService.deleteUser(id);
      res.json({ message: 'Пользователь удален' });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  async getUserStats(req: Request, res: Response) {
    try {
      const stats = await userService.getUserStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }
}



