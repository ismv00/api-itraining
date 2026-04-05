import { Request, Response, NextFunction } from "express";
import { ExerciseService } from "./exercise.service";

const service = new ExerciseService();

export class ExerciseController {
  async create(
    req: Request<{ workoutId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { name, sets, reps, weight } = req.body;

      const exercise = await service.create(
        req.params.workoutId,
        req.user!.userId,
        req.user!.role,
        name,
        sets,
        reps,
        weight,
      );
      res.status(201).json(exercise);
    } catch (error) {
      next(error);
    }
  }

  async list(
    req: Request<{ workoutId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const exercises = await service.list(
        req.params.workoutId,
        req.user!.userId,
        req.user!.role,
      );
      res.json(exercises);
    } catch (error) {
      next(error);
    }
  }

  async updateFinalWeight(
    req: Request<{ exerciseId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { finalWeight } = req.body;
      const exercise = await service.updateFinalWeight(
        req.params.exerciseId,
        req.user!.userId,
        finalWeight,
      );
      res.json(exercise);
    } catch (error) {
      next(error);
    }
  }

  async remove(
    req: Request<{ exerciseId: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await service.remove(
        req.params.exerciseId,
        req.user!.userId,
        req.user!.role,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
