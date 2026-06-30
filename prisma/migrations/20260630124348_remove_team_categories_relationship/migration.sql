/*
  Warnings:

  - You are about to drop the `team_category` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "team_category" DROP CONSTRAINT "team_category_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "team_category" DROP CONSTRAINT "team_category_teamId_fkey";

-- DropIndex
DROP INDEX "teams_permalink_category_format_idx";

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "category_name" TEXT;

-- DropTable
DROP TABLE "team_category";

-- CreateIndex
CREATE INDEX "teams_permalink_format_idx" ON "teams"("permalink", "format");
