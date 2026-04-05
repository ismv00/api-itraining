import { Router } from "express";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { studentRoutes } from "./modules/students/student.routes";
import { workoutRoutes } from "./modules/workout/workout.routes";
import { linkRoutes } from "./modules/Link/Link.routes";
import { exerciseRoutes } from "./modules/exercise/exercise.route";

export const routes = Router();

routes.use("/auth", authRoutes);
routes.use("/users", userRoutes);
routes.use("/students", studentRoutes);
routes.use("/links", linkRoutes);

routes.use("/workouts", workoutRoutes);

routes.use("/workouts/:workoutId/exercises", exerciseRoutes);

routes.get("/", (req, res) => {
  res.json({ message: "iTraining API" });
});
