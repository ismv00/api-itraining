import { Request, Response, NextFunction } from "express";
import { AppError } from "../../utils/AppError";
import { prisma } from "../../database/prisma";

import { UserService } from "./user.service";

const userService = new UserService();

export class UserController {
  async me(req: Request, res: Response) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user!.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      return res.json(user);
    } catch {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  personalOnly(req: Request, res: Response) {
    return res.json({
      message: "Only Personal can access this route",
      user: req.user,
    });
  }

  async findPersonal(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.query;

      const personal = await prisma.user.findFirst({
        where: {
          email: email as string,
          role: "PERSONAL",
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      if (!personal) {
        throw new AppError("Personal não encontrado", 404);
      }

      return res.json(personal);
    } catch (error) {
      next(error);
    }
  }

  async deleteAccount(req: Request, res: Response, next: NextFunction) {
    try {
      await userService.deleteAccount(req.user!.userId);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
