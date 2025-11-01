/*
  Warnings:

  - You are about to drop the column `wings` on the `standings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "standings" DROP COLUMN "wings",
ADD COLUMN     "wins" INTEGER NOT NULL DEFAULT 0;
