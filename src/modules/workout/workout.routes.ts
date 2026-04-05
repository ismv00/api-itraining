import { Router } from "express";
import { WorkoutController } from "./workout.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";
import { validate } from "../../middlewares/validate.middleware";
import { createWorkoutSchema } from "./workout.schema";

const router = Router();
const controller = new WorkoutController();

router.post(
  "/",
  authMiddleware,
  validate(createWorkoutSchema),
  controller.create,
);
router.get("/", authMiddleware, controller.list);

export { router as workoutRoutes };
