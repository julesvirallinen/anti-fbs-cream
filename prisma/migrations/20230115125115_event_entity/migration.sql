/*
  Warnings:

  - You are about to drop the column `verificationCode` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('took_shower', 'smoked_cigarette');

-- DropIndex
DROP INDEX "users_email_verificationCode_idx";

-- DropIndex
DROP INDEX "users_email_verificationCode_key";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "verificationCode";

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "type" "EventType" NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);
