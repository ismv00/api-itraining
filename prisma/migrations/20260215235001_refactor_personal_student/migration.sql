/*
  Warnings:

  - You are about to drop the column `personalId` on the `User` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "LinkStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_personalId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "personalId";

-- CreateTable
CREATE TABLE "PersonalStudent" (
    "id" TEXT NOT NULL,
    "personalId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "status" "LinkStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonalStudent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PersonalStudent_personalId_studentId_key" ON "PersonalStudent"("personalId", "studentId");

-- AddForeignKey
ALTER TABLE "PersonalStudent" ADD CONSTRAINT "PersonalStudent_personalId_fkey" FOREIGN KEY ("personalId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PersonalStudent" ADD CONSTRAINT "PersonalStudent_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
