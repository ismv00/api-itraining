import { Router } from "express";
import { LinkController } from "./link.controller";
import { authMiddleware } from "../../middlewares/auth.middlewares";
import { roleMiddleware } from "../../middlewares/role.middleware";
import { Role } from "../../generated/prisma/enums";
import { validate } from "../../middlewares/validate.middleware";
import { requestLinkSchema } from "./link.schema";

const router = Router();
const controller = new LinkController();

// rotas do aluno
router.post(
  "/",
  authMiddleware,
  roleMiddleware(Role.STUDENT),
  validate(requestLinkSchema),
  controller.requestLink,
);
router.get(
  "/pending",
  authMiddleware,
  roleMiddleware(Role.STUDENT),
  controller.getPendingLinks,
);
router.patch(
  "/:id/approve",
  authMiddleware,
  roleMiddleware(Role.STUDENT),
  controller.approve,
);
router.patch(
  "/:id/reject",
  authMiddleware,
  roleMiddleware(Role.STUDENT),
  controller.reject,
);

// rotas do personal
router.get(
  "/personal/pending",
  authMiddleware,
  roleMiddleware(Role.PERSONAL),
  controller.getPendingLinksByPersonal,
);
router.patch(
  "/personal/:id/approve",
  authMiddleware,
  roleMiddleware(Role.PERSONAL),
  controller.approveByPersonal,
);
router.patch(
  "/personal/:id/reject",
  authMiddleware,
  roleMiddleware(Role.PERSONAL),
  controller.rejectByPersonal,
);

router.get(
  "/approved",
  authMiddleware,
  roleMiddleware(Role.STUDENT),
  controller.getApprovedLink,
);

export { router as linkRoutes };
