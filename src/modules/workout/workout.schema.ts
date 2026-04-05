import { z } from "zod";

export const createWorkoutSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  studentId: z.string().uuid("Invalid studentId"),
});
