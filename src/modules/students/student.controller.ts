import { Request, Response, NextFunction } from "express";
import { StudentService } from "./student.service";

const service = new StudentService();

export class StudentController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const personalId = req.user!.userId;

      const student = await service.createStudent(
        personalId,
        name,
        email,
        password,
      );

      res.status(201).json(student);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const personalId = req.user!.userId;

      const students = await service.listStudents(personalId);

      res.json(students);
    } catch (error) {
      next(error);
    }
  }
}
