-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "division" TEXT NOT NULL DEFAULT 'none',
ADD COLUMN     "group" TEXT NOT NULL DEFAULT 'none';
