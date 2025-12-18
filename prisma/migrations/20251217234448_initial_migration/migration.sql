-- CreateEnum
CREATE TYPE "Role" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('scheduled', 'inProgress', 'completed', 'postPosed', 'canceled');

-- CreateEnum
CREATE TYPE "ShootoutStatus" AS ENUM ('in_progress', 'completed');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "email_verified" TIMESTAMP(3),
    "image_url" TEXT,
    "image_public_id" TEXT,
    "password" TEXT NOT NULL,
    "roles" "Role"[] DEFAULT ARRAY['user']::"Role"[],
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "description" TEXT,
    "division" TEXT,
    "group" TEXT,
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
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "permalink" TEXT NOT NULL,
    "headquarters" TEXT,
    "image_url" TEXT,
    "image_public_id" TEXT,
    "division" TEXT,
    "group" TEXT,
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
    "team_id" TEXT NOT NULL,
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
    "tournament_id" TEXT,
    "team_id" TEXT,
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
    "image_public_id" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "gallery_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_image_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "tournaments_permalink_key" ON "tournaments"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "teams_permalink_key" ON "teams"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "coaches_email_key" ON "coaches"("email");

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
CREATE UNIQUE INDEX "gallery_image_permalink_key" ON "gallery_image"("permalink");

-- CreateIndex
CREATE UNIQUE INDEX "gallery_image_imageUrl_key" ON "gallery_image"("imageUrl");

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_coach_id_fkey" FOREIGN KEY ("coach_id") REFERENCES "coaches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "players" ADD CONSTRAINT "players_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_local_id_fkey" FOREIGN KEY ("local_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_visitor_id_fkey" FOREIGN KEY ("visitor_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "penalty_kicks" ADD CONSTRAINT "penalty_kicks_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_player_id_fkey" FOREIGN KEY ("player_id") REFERENCES "players"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credentials" ADD CONSTRAINT "credentials_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "standings" ADD CONSTRAINT "standings_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_tournament_id_fkey" FOREIGN KEY ("tournament_id") REFERENCES "tournaments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery" ADD CONSTRAINT "gallery_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gallery_image" ADD CONSTRAINT "gallery_image_gallery_id_fkey" FOREIGN KEY ("gallery_id") REFERENCES "gallery"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
