-- AlterTable
ALTER TABLE "public"."Autoevaluation" ADD COLUMN     "address" TEXT;

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "email" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "Autoevaluation_latitude_longitude_idx" ON "public"."Autoevaluation"("latitude", "longitude");
