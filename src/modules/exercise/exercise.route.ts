import { Router } from "express";
import { ExerciseController } from "./exercise.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";
import { validate } from "../../middlewares/validate.middleware";
import {
  createExerciseSchema,
  updateFinalWeightSchema,
} from "./exercise.schema";

const router = Router({ mergeParams: true });
const controller = new ExerciseController();

router.post(
  "/",
  authMiddleware,
  validate(createExerciseSchema),
  controller.create,
);
router.get("/", authMiddleware, controller.list);
router.patch(
  "/:exerciseId/final-weight",
  authMiddleware,
  validate(updateFinalWeightSchema),
  controller.updateFinalWeight,
);
router.delete("/:exerciseId", authMiddleware, controller.remove);

export { router as exerciseRoutes };
