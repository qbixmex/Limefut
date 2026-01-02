-- DropIndex
DROP INDEX "tournaments_permalink_key";

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "category" TEXT,
ADD COLUMN     "format" TEXT;
