/*
  Warnings:

  - Made the column `image_public_id` on table `gallery_image` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "gallery" DROP CONSTRAINT "gallery_team_id_fkey";

-- AlterTable
ALTER TABLE "gallery" ADD COLUMN     "tournament_id" TEXT,
ALTER COLUMN "team_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "gallery_image" ALTER COLUMN "image_public_id" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;
