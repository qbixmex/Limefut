/*
  Warnings:

  - You are about to drop the column `division` on the `teams` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `teams` table. All the data in the column will be lost.
  - Made the column `category` on table `teams` required. This step will fail if there are existing NULL values in that column.
  - Made the column `format` on table `teams` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "teams_permalink_key";

-- AlterTable
ALTER TABLE "teams" DROP COLUMN "division",
DROP COLUMN "group",
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "format" SET NOT NULL;

-- CreateIndex
CREATE INDEX "teams_permalink_category_format_idx" ON "teams"("permalink", "category", "format");
