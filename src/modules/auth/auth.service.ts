import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/AppError";

const JWT_SECRET = process.env.JWT_SECRET as string;

export class AuthService {
  async register(
    name: string,
    email: string,
    password: string,
    role: "PERSONAL" | "STUDENT",
  ) {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError("User already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async createStudentByPersonal(
    personalId: string,
    name: string,
    email: string,
    password: string,
  ) {
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new AppError("User already exists", 400);
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

    const { password: _, ...studentWithoutPassword } = student;
    return studentWithoutPassword;
  }

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("invalid credentials");
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "1d" },
    );

    return { token };
  }
}
