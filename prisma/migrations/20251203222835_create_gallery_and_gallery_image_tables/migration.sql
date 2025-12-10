-- CreateTable
CREATE TABLE "gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "gallery_date" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_image" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "image_public_id" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "gallery_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "gallery_title_key" ON "gallery"("title");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_permalink_key" ON "gallery"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_image_permalink_key" ON "gallery_image"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_image_imageUrl_key" ON "gallery_image"("imageUrl");

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_image" ADD CONSTRAINT "gallery_image_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "gallery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
