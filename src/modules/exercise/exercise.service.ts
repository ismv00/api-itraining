import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/AppError";

export class ExerciseService {
  async create(
    workoutId: string,
    userId: string,
    role: "PERSONAL" | "STUDENT",
    name: string,
    sets: number,
    reps: number,
    weight?: number,
  ) {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new AppError("Workout not found", 404);
    }

    if (role === "PERSONAL") {
      const link = await prisma.personalStudent.findFirst({
        where: {
          personalId: userId,
          studentId: workout.studentId,
          status: "APPROVED",
        },
      });

      if (!link) {
        throw new AppError("Forbidden", 403);
      }
    }

    if (role === "STUDENT" && workout.studentId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return prisma.exercise.create({
      data: { workoutId, name, sets, reps, weight },
    });
  }

  async list(workoutId: string, userId: string, role: "PERSONAL" | "STUDENT") {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new AppError("Workout not found", 404);
    }

    if (role === "PERSONAL") {
      const link = await prisma.personalStudent.findFirst({
        where: {
          personalId: userId,
          studentId: workout.studentId,
          status: "APPROVED",
        },
      });

      if (!link) throw new AppError("Forbidden", 403);
    }

    if (role === "STUDENT" && workout.studentId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return prisma.exercise.findMany({ where: { workoutId } });
  }

  async updateFinalWeight(
    exerciseId: string,
    userId: string,
    finalWeight: number,
  ) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { workout: true },
    });

    if (!exercise) throw new Error("Exercise not found");

    if (exercise.workout.studentId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return prisma.exercise.update({
      where: { id: exerciseId },
      data: { finalWeight },
    });
  }

  async remove(
    exerciseId: string,
    userId: string,
    role: "PERSONAL" | "STUDENT",
  ) {
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
      include: { workout: true },
    });

    if (!exercise) throw new Error("Exercise not found");

    if (role === "PERSONAL") {
      const link = await prisma.personalStudent.findFirst({
        where: {
          personalId: userId,
          studentId: exercise.workout.studentId,
          status: "APPROVED",
        },
      });

      if (!link) throw new AppError("Forbidden", 403);
    }

    if (role === "STUDENT" && exercise.workout.studentId !== userId) {
      throw new AppError("Forbidden", 403);
    }

    return prisma.exercise.delete({ where: { id: exerciseId } });
  }
}
