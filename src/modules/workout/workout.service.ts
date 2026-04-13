import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/AppError";

export class WorkoutService {
  async createWorkout(
    userId: string,
    role: "PERSONAL" | "STUDENT",
    studentId: string,
    title: string,
    description: string,
  ) {
    if (role === "PERSONAL") {
      const link = await prisma.personalStudent.findFirst({
        where: {
          personalId: userId,
          studentId,
          status: "APPROVED",
        },
      });

      if (!link) {
        throw new Error("Student not linked or link not approved");
      }
    }

    if (role === "STUDENT") {
      const approvedLink = await prisma.personalStudent.findFirst({
        where: {
          studentId: userId,
          status: "APPROVED",
        },
      });

      if (approvedLink) {
        throw new Error(
          "You cannot create workouts while assigned to a personal trainer",
        );
      }

      studentId = userId;
    }

    return prisma.workout.create({
      data: {
        title,
        description,
        studentId,
        createdById: userId,
      },
    });
  }

  async listWorkouts(userId: string, role: "PERSONAL" | "STUDENT") {
    if (role === "PERSONAL") {
      return prisma.workout.findMany({
        where: {
          student: {
            studentLinks: {
              some: {
                personalId: userId,
                status: "APPROVED",
              },
            },
          },
        },
        include: {
          student: true,
        },
      });
    }

    return prisma.workout.findMany({
      where: {
        studentId: userId,
      },
    });
  }

  async deleteWorkout(
    workoutId: string,
    userId: string,
    role: "PERSONAL" | "STUDENT",
  ) {
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
    });

    if (!workout) throw new AppError("Workout not found", 404);

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

    await prisma.workout.delete({
      where: { id: workoutId },
    });
  }
}
