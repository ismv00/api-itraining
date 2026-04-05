import { Router } from 'express';
import { UserController } from './user.controller';
import { authMiddleware } from '../../middlewares/auth.middlewares';
import { roleMiddleware } from '../../middlewares/role.middleware';
import { Role } from '../../generated/prisma/enums';

const router = Router();
const controller = new UserController();

router.get('/me', authMiddleware, controller.me);

router.get(
  '/personal-area',
  authMiddleware,
  roleMiddleware(Role.PERSONAL),
  controller.personalOnly
);

export { router as userRoutes };
