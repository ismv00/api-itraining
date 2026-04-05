import { Router } from "express";
import { StudentController } from "./student.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../../middlewares/validate.middleware";

import { createStudentSchema } from "./student.schema";

const router = Router();
const controller = new StudentController();

router.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.PERSONAL),
  validate(createStudentSchema),
  controller.create,
);
router.get("/", authMiddleware, roleMiddleware(Role.PERSONAL), controller.list);

export { router as studentRoutes };
