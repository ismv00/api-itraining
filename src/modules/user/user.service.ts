import { prisma } from "../../database/prisma";
import { AppError } from "../../utils/AppError";

export class UserService {
  async deleteAccount(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found", 404);
    }

    await prisma.user.delete({
      where: { id: userId },
    });
  }
}
