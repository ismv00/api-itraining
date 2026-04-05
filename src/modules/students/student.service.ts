import { prisma } from "../../database/prisma";
import bcrypt from "bcryptjs";

export class StudentService {
  async createStudent(
    personalId: string,
    name: string,
    email: string,
    password: string,
  ) {
    const emailExists = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExists) {
      throw new Error("E-mail already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "STUDENT",
      },
    });

    await prisma.personalStudent.create({
      data: {
        personalId,
        studentId: student.id,
        status: "APPROVED",
      },
    });

    return student;
  }

  async listStudents(personalId: string) {
    return prisma.personalStudent.findMany({
      where: {
        personalId,
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
    });
  }
}
