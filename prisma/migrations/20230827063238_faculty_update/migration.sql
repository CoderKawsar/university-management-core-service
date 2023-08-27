/*
  Warnings:

  - Added the required column `firstName` to the `faculties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "faculties" ADD COLUMN     "firstName" TEXT NOT NULL,
ALTER COLUMN "middleName" DROP NOT NULL,
ALTER COLUMN "profileImage" DROP NOT NULL,
ALTER COLUMN "bloodGroup" DROP NOT NULL;
