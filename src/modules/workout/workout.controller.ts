import { Request, Response, NextFunction } from "express";
import { WorkoutService } from "./workout.service";

const service = new WorkoutService();

export class WorkoutController {
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { title, description, studentId } = req.body;

      const workout = await service.createWorkout(
        req.user!.userId,
        req.user!.role,
        studentId,
        title,
        description,
      );

      res.status(201).json(workout);
    } catch (error) {
      next(error);
    }
  }

  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const workouts = await service.listWorkouts(
        req.user!.userId,
        req.user!.role,
      );

      res.json(workouts);
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      await service.deleteWorkout(
        req.params.id,
        req.user!.userId,
        req.user!.role,
      );
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}
