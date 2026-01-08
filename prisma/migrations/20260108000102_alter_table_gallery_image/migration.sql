/*
  Warnings:

  - You are about to drop the column `permalink` on the `gallery_image` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "gallery_image" DROP COLUMN "permalink",
ADD COLUMN     "position" INTEGER NOT NULL DEFAULT 0;
