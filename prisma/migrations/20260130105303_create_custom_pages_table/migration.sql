-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('draft', 'hold', 'unpublished', 'published');

-- CreateTable
CREATE TABLE "custom_pages" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "permalink" TEXT,
    "content" TEXT,
    "position" INTEGER,
    "seo_title" TEXT,
    "seo_description" TEXT,
    "seo_robots" TEXT DEFAULT 'noindex, nofollow',
    "status" "PageStatus" NOT NULL DEFAULT 'draft',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "custom_pages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "custom_pages_permalink_key" ON "custom_pages"("permalink");
