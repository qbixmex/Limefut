-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('female', 'male');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('regular', 'playoffs', 'finals');

-- AlterTable
ALTER TABLE "teams" ADD COLUMN     "category" TEXT,
ADD COLUMN     "format" TEXT,
ADD COLUMN     "gender" "Gender" NOT NULL DEFAULT 'male';

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "stage" "Stage" NOT NULL DEFAULT 'regular';
