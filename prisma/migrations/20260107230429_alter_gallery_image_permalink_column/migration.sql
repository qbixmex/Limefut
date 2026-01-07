-- DropIndex
DROP INDEX "gallery_image_permalink_key";

-- AlterTable
ALTER TABLE "gallery_image" ALTER COLUMN "permalink" DROP NOT NULL;
