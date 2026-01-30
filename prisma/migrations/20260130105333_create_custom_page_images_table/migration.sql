-- CreateTable
CREATE TABLE "custom_page_images" (
    "id" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "custom_page_id" TEXT NOT NULL,

    CONSTRAINT "custom_page_images_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "custom_page_images" ADD CONSTRAINT "custom_page_images_custom_page_id_fkey" FOREIGN KEY ("custom_page_id") REFERENCES "custom_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;
