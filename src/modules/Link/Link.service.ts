import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/AppError";

export class LinkService {
  async getPendingLinks(studentId: string) {
    return prisma.personalStudent.findMany({
      where: {
        studentId,
        status: "PENDING",
      },
      include: {
        personal: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async approve(linkId: string, studentId: string) {
    const link = await prisma.personalStudent.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      throw new AppError("Link not found", 404);
    }

    if (link.studentId !== studentId) {
      throw new AppError("Forbidden", 403);
    }

    if (link.status !== "PENDING") {
      throw new Error(`Link already ${link.status.toLowerCase()}`);
    }

    return prisma.personalStudent.update({
      where: { id: linkId },
      data: { status: "APPROVED" },
    });
  }

  async reject(linkId: string, studentId: string) {
    const link = await prisma.personalStudent.findUnique({
      where: { id: linkId },
    });

    if (!link) {
      throw new AppError("Link not found", 404);
    }

    if (link.studentId !== studentId) {
      throw new AppError("Forbidden", 403);
    }

    if (link.status !== "PENDING") {
      throw new Error(`Link already ${link.status.toLowerCase()}`);
    }

    return prisma.personalStudent.update({
      where: { id: linkId },
      data: { status: "REJECTED" },
    });
  }

  async requestLink(studentId: string, personalId: string) {
    const personal = await prisma.user.findUnique({
      where: { id: personalId },
    });

    if (!personal || personal.role !== "PERSONAL") {
      throw new AppError("Personal not found", 404);
    }

    const existingLink = await prisma.personalStudent.findUnique({
      where: {
        personalId_studentId: { personalId, studentId },
      },
    });

    if (existingLink) {
      throw new AppError("Link already exists", 400);
    }

    return prisma.personalStudent.create({
      data: {
        personalId,
        studentId,
        status: "PENDING",
      },
    });
  }

  async getPendingLinksByPersonal(personalId: string) {
    return prisma.personalStudent.findMany({
      where: {
        personalId,
        status: "PENDING",
      },
      include: {
        student: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async approveByPersonal(linkId: string, personalId: string) {
    const link = await prisma.personalStudent.findUnique({
      where: { id: linkId },
    });

    if (!link) throw new AppError("Link not found", 404);
    if (link.personalId !== personalId) throw new AppError("Forbbiden", 403);
    if (link.status !== "PENDING")
      throw new AppError(`Link already ${link.status.toLowerCase()}`, 400);

    return prisma.personalStudent.update({
      where: { id: linkId },
      data: { status: "APPROVED" },
    });
  }

  async rejectByPersonal(linkId: string, personalId: string) {
    const link = await prisma.personalStudent.findUnique({
      where: { id: linkId },
    });

    if (!link) throw new AppError("Link not found", 404);
    if (link.personalId !== personalId) throw new AppError("Forbbiden", 403);
    if (link.status !== "PENDING")
      throw new AppError(`Link already ${link.status.toLowerCase()}`);

    return prisma.personalStudent.update({
      where: { id: linkId },
      data: { status: "REJECTED" },
    });
  }
}
