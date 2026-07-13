/*
  Warnings:

  - You are about to drop the column `category` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `current_week` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `format` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `gender` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `stage` on the `tournaments` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `tournaments` table. All the data in the column will be lost.
  - You are about to alter the column `name` on the `tournaments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `permalink` on the `tournaments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(255)`.
  - You are about to alter the column `country` on the `tournaments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - You are about to alter the column `season` on the `tournaments` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.
  - A unique constraint covering the columns `[permalink]` on the table `tournaments` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "tournaments_permalink_category_format_gender_idx";

-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "category",
DROP COLUMN "city",
DROP COLUMN "current_week",
DROP COLUMN "format",
DROP COLUMN "gender",
DROP COLUMN "stage",
DROP COLUMN "state",
ALTER COLUMN "name" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "permalink" SET DATA TYPE VARCHAR(255),
ALTER COLUMN "country" SET DATA TYPE VARCHAR(100),
ALTER COLUMN "season" SET DATA TYPE VARCHAR(100);

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_permalink_key" ON "tournaments"("permalink");
