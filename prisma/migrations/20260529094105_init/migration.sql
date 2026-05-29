-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('female', 'male');

-- CreateEnum
CREATE TYPE "Stage" AS ENUM ('regular', 'playoffs', 'finals');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('scheduled', 'inProgress', 'completed', 'postPosed', 'canceled');

-- CreateEnum
CREATE TYPE "PageStatus" AS ENUM ('draft', 'hold', 'unpublished', 'published');

-- CreateEnum
CREATE TYPE "ShootoutStatus" AS ENUM ('in_progress', 'completed');

-- CreateEnum
CREATE TYPE "Alignment" AS ENUM ('left', 'center', 'right');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" BOOLEAN,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "password" TEXT,
    "roles" "Role"[] DEFAULT ARRAY['user']::"Role"[],
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'male',
    "format" TEXT NOT NULL,
    "stage" "Stage" NOT NULL DEFAULT 'regular',
    "country" TEXT,
    "state" TEXT,
    "city" TEXT,
    "season" TEXT,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "current_week" INTEGER DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "permalink" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournament_category" (
    "tournamentId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "tournament_category_pkey" PRIMARY KEY ("tournamentId","categoryId")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "category" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "gender" "Gender" NOT NULL DEFAULT 'male',
    "country" TEXT,
    "city" TEXT,
    "state" TEXT,
    "emails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "address" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "coach_id" TEXT,
    "tournament_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_category" (
    "teamId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "team_category_pkey" PRIMARY KEY ("teamId","categoryId")
);

-- CreateTable
CREATE TABLE "team_fields" (
    "teamId" TEXT NOT NULL,
    "fieldId" TEXT NOT NULL,

    CONSTRAINT "team_fields_pkey" PRIMARY KEY ("teamId","fieldId")
);

-- CreateTable
CREATE TABLE "fields" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "city" VARCHAR,
    "state" VARCHAR,
    "country" VARCHAR,
    "address" VARCHAR,
    "map" VARCHAR,
    "permalink" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "coaches" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "age" INTEGER,
    "nationality" TEXT,
    "imageUrl" TEXT,
    "image_public_id" TEXT,
    "description" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "coaches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "players" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "birthday" TIMESTAMP(3),
    "nationality" TEXT,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "team_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" TEXT NOT NULL,
    "local_id" TEXT NOT NULL,
    "visitor_id" TEXT NOT NULL,
    "local_score" INTEGER DEFAULT 0,
    "visitor_score" INTEGER DEFAULT 0,
    "place" TEXT,
    "match_date" TIMESTAMP(3),
    "week" INTEGER,
    "referee" TEXT,
    "status" "Status" NOT NULL DEFAULT 'scheduled',
    "tournament_id" TEXT NOT NULL,
    "category_id" TEXT,
    "field_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penalties_shootouts" (
    "id" TEXT NOT NULL,
    "match_id" TEXT NOT NULL,
    "local_team_id" TEXT NOT NULL,
    "visitor_team_id" TEXT NOT NULL,
    "local_goals" INTEGER NOT NULL DEFAULT 0,
    "visitor_goals" INTEGER NOT NULL DEFAULT 0,
    "winner_team_id" TEXT,
    "status" "ShootoutStatus" NOT NULL DEFAULT 'in_progress',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penalties_shootouts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "penalty_kicks" (
    "id" TEXT NOT NULL,
    "shootout_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "player_id" TEXT,
    "shooter_name" TEXT,
    "order" INTEGER NOT NULL,
    "is_goal" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "penalty_kicks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credentials" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "birthdate" TIMESTAMP(3) NOT NULL,
    "curp" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "jersey_number" INTEGER NOT NULL,
    "player_id" TEXT NOT NULL,
    "tournament_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "standings" (
    "id" TEXT NOT NULL,
    "matches_played" INTEGER NOT NULL DEFAULT 0,
    "wins" INTEGER NOT NULL DEFAULT 0,
    "draws" INTEGER NOT NULL DEFAULT 0,
    "losses" INTEGER NOT NULL DEFAULT 0,
    "goals_for" INTEGER NOT NULL DEFAULT 0,
    "goals_against" INTEGER NOT NULL DEFAULT 0,
    "goals_difference" INTEGER NOT NULL DEFAULT 0,
    "additional_points" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "total_points" INTEGER NOT NULL DEFAULT 0,
    "tournament_id" TEXT NOT NULL,
    "team_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "standings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "gallery_date" TIMESTAMP(3) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_image" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "image_public_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "gallery_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_image_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "hero_banners" (
    "id" TEXT NOT NULL,
    "title" VARCHAR NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT NOT NULL,
    "data_alignment" "Alignment" NOT NULL DEFAULT 'left',
    "show_data" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sponsors" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "url" TEXT,
    "image_url" TEXT NOT NULL,
    "image_public_id" TEXT NOT NULL,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "position" INTEGER NOT NULL DEFAULT 0,
    "alignment" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sponsors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "announcements" (
    "id" TEXT NOT NULL,
    "title" VARCHAR NOT NULL,
    "permalink" VARCHAR NOT NULL,
    "published_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "description" VARCHAR NOT NULL,
    "content" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "announcements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "videos" (
    "id" TEXT NOT NULL,
    "title" VARCHAR NOT NULL,
    "permalink" VARCHAR NOT NULL,
    "published_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" VARCHAR NOT NULL,
    "url" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

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
    "google_analytics_id" VARCHAR(255),
    "google_tag_manager" VARCHAR(255),
    "meta_pixel_id" VARCHAR(255),
    "default_language" VARCHAR(3) DEFAULT 'es',
    "time_zone" VARCHAR(100) DEFAULT 'America/Mexico_City',
    "contact_email" VARCHAR(255),
    "from_email" VARCHAR(255),
    "reply_to_email" VARCHAR(255),
    "seo_title" VARCHAR(100),
    "seo_description" VARCHAR(200),
    "og_image_url" VARCHAR(255),
    "og_image_id" VARCHAR(255),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "global_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_sections" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(70) NOT NULL,
    "permalink" TEXT NOT NULL,
    "description" VARCHAR(165) NOT NULL,
    "robots" VARCHAR(20) NOT NULL DEFAULT 'index, follow',
    "global_settings_id" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "seo_sections_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE INDEX "account_userId_idx" ON "account"("userId");

-- CreateIndex
CREATE INDEX "verification_identifier_idx" ON "verification"("identifier");

-- CreateIndex
CREATE INDEX "tournaments_permalink_category_format_gender_idx" ON "tournaments"("permalink", "category", "format", "gender");

-- CreateIndex
CREATE UNIQUE INDEX "categories_permalink_key" ON "categories"("permalink");

-- CreateIndex
CREATE INDEX "teams_permalink_category_format_idx" ON "teams"("permalink", "category", "format");

-- CreateIndex
CREATE UNIQUE INDEX "fields_permalink_key" ON "fields"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "coaches_email_key" ON "coaches"("email");

-- CreateIndex
CREATE INDEX "matches_tournament_id_local_id_visitor_id_category_id_field_idx" ON "matches"("tournament_id", "local_id", "visitor_id", "category_id", "field_id");

-- CreateIndex
CREATE UNIQUE INDEX "penalties_shootouts_match_id_key" ON "penalties_shootouts"("match_id");

-- CreateIndex
CREATE INDEX "penalties_shootouts_match_id_idx" ON "penalties_shootouts"("match_id");

-- CreateIndex
CREATE UNIQUE INDEX "penalty_kicks_shootout_id_team_id_order_key" ON "penalty_kicks"("shootout_id", "team_id", "order");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_curp_key" ON "credentials"("curp");

-- CreateIndex
CREATE UNIQUE INDEX "credentials_player_id_key" ON "credentials"("player_id");

-- CreateIndex
CREATE UNIQUE INDEX "standings_team_id_key" ON "standings"("team_id");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_title_key" ON "gallery"("title");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_permalink_key" ON "gallery"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_image_imageUrl_key" ON "gallery_image"("imageUrl");

-- CreateIndex
CREATE UNIQUE INDEX "custom_pages_permalink_key" ON "custom_pages"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "hero_banners_title_key" ON "hero_banners"("title");

-- CreateIndex
CREATE UNIQUE INDEX "sponsors_name_key" ON "sponsors"("name");

-- CreateIndex
CREATE UNIQUE INDEX "announcements_title_key" ON "announcements"("title");

-- CreateIndex
CREATE UNIQUE INDEX "announcements_permalink_key" ON "announcements"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "videos_title_key" ON "videos"("title");

-- CreateIndex
CREATE UNIQUE INDEX "videos_permalink_key" ON "videos"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "seo_sections_permalink_key" ON "seo_sections"("permalink");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_category" ADD CONSTRAINT "tournament_category_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournament_category" ADD CONSTRAINT "tournament_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_category" ADD CONSTRAINT "team_category_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_category" ADD CONSTRAINT "team_category_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_fields" ADD CONSTRAINT "team_fields_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_fields" ADD CONSTRAINT "team_fields_fieldId_fkey" FOREIGN KEY ("fieldId") REFERENCES "fields"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_field_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_match_id_fkey" FOREIGN KEY ("match_id") REFERENCES "matches"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_local_team_id_fkey" FOREIGN KEY ("local_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_visitor_team_id_fkey" FOREIGN KEY ("visitor_team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalties_shootouts" ADD CONSTRAINT "penalties_shootouts_winner_team_id_fkey" FOREIGN KEY ("winner_team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_kicks" ADD CONSTRAINT "penalty_kicks_shootout_id_fkey" FOREIGN KEY ("shootout_id") REFERENCES "penalties_shootouts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_kicks" ADD CONSTRAINT "penalty_kicks_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "penalty_kicks" ADD CONSTRAINT "penalty_kicks_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_image" ADD CONSTRAINT "gallery_image_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "gallery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custom_page_images" ADD CONSTRAINT "custom_page_images_custom_page_id_fkey" FOREIGN KEY ("custom_page_id") REFERENCES "custom_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seo_sections" ADD CONSTRAINT "seo_sections_global_settings_id_fkey" FOREIGN KEY ("global_settings_id") REFERENCES "global_settings"("id") ON DELETE CASCADE ON UPDATE CASCADE;
