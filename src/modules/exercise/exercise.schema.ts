import { z } from "zod";

export const createExerciseSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sets: z.number().int().positive("Sets must be a positive integer"),
  reps: z.number().int().positive("Reps must be a positive integer"),
  weight: z.number().positive("Weight must be positive").optional(),
});

export const updateFinalWeightSchema = z.object({
  finalWeight: z.number().positive("Final weight must be positive"),
});
