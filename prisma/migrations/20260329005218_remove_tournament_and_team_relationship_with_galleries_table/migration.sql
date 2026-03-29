/*
  Warnings:

  - You are about to drop the column `team_id` on the `gallery` table. All the data in the column will be lost.
  - You are about to drop the column `tournament_id` on the `gallery` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "gallery" DROP CONSTRAINT "gallery_team_id_fkey";

-- DropForeignKey
ALTER TABLE "gallery" DROP CONSTRAINT "gallery_tournament_id_fkey";

-- AlterTable
ALTER TABLE "gallery" DROP COLUMN "team_id",
DROP COLUMN "tournament_id";
