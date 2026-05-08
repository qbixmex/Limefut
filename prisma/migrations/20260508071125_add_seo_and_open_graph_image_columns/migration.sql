/*
  Warnings:

  - You are about to drop the column `accent_color` on the `global_settings` table. All the data in the column will be lost.
  - You are about to drop the column `primary_color` on the `global_settings` table. All the data in the column will be lost.
  - You are about to drop the column `secondary_color` on the `global_settings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "global_settings" DROP COLUMN "accent_color",
DROP COLUMN "primary_color",
DROP COLUMN "secondary_color",
ADD COLUMN     "og_image_id" VARCHAR(255),
ADD COLUMN     "og_image_url" VARCHAR(255),
ADD COLUMN     "seo_description" VARCHAR(200),
ADD COLUMN     "seo_title" VARCHAR(100);
