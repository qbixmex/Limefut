-- CreateTable
CREATE TABLE "field" (
    "id" TEXT NOT NULL,
    "name" VARCHAR NOT NULL,
    "city" VARCHAR,
    "state" VARCHAR,
    "country" VARCHAR,
    "address" VARCHAR,
    "map" VARCHAR,
    "permalink" TEXT NOT NULL,
    "team_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "field_permalink_key" ON "field"("permalink");

-- AddForeignKey
ALTER TABLE "field" ADD CONSTRAINT "field_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;
