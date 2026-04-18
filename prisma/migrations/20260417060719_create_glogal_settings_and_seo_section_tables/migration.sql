-- CreateTable
CREATE TABLE "global_settings" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "site_name" VARCHAR(100),
    "organization_name" VARCHAR(100),
    "phone" VARCHAR(150),
    "address" VARCHAR(255),
    "maps_url" VARCHAR(255),
    "country" VARCHAR(50) DEFAULT 'Mexico',
    "logo_url" VARCHAR(255),
    "logo_public_id" VARCHAR(255),
    "logo_admin_url" VARCHAR(255),
    "logo_admin_public_id" VARCHAR(255),
    "favicon_url" VARCHAR(255),
    "favicon_id" VARCHAR(255),
    "facebook_url" VARCHAR(255),
    "twitter_x_url" VARCHAR(255),
    "instagram_url" VARCHAR(255),
    "youtube_url" VARCHAR(255),
    "tiktok_url" VARCHAR(255),
    "whats_app" VARCHAR(100),
    "maintenance_mode" BOOLEAN NOT NULL DEFAULT false,
    "maintenance_message" VARCHAR(255),
    "primary_color" VARCHAR(50),
    "secondary_color" VARCHAR(50),
    "accent_color" VARCHAR(50),
    "google_analytics_id" VARCHAR(255),
    "google_tag_manager" VARCHAR(255),
    "meta_pixel_id" VARCHAR(255),
    "default_language" VARCHAR(3) DEFAULT 'es',
    "time_zone" VARCHAR(100) DEFAULT 'America/Mexico_City',
    "contact_email" VARCHAR(255),
    "from_email" VARCHAR(255),
    "reply_to_email" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_sections" (
    "id" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "description" VARCHAR(165) NOT NULL,
    "robots" VARCHAR(20) NOT NULL DEFAULT 'index, follow',
    "global_settings_id" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "seo_sections_permalink_key" ON "seo_sections"("permalink");

-- AddForeignKey
ALTER TABLE "seo_sections" ADD CONSTRAINT "seo_sections_global_settings_id_fkey" FOREIGN KEY ("global_settings_id") REFERENCES "global_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
