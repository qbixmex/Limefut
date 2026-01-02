/*
  Warnings:

  - You are about to drop the column `division` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `group` on the `tournaments` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[category]` on the table `tournaments` will be added. If there are existing duplicate values, this will fail.
  - Made the column `category` on table `tournaments` required. This step will fail if there are existing NULL values in that column.
  - Made the column `format` on table `tournaments` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "division",
DROP COLUMN "group",
ALTER COLUMN "category" SET NOT NULL,
ALTER COLUMN "format" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_category_key" ON "tournaments"("category");

-- CreateIndex
CREATE INDEX "tournaments_category_format_idx" ON "tournaments"("category", "format");
