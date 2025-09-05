-- CreateEnum
CREATE TYPE "public"."RiskLevel" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "public"."SymptomSeverity" AS ENUM ('mild', 'moderate', 'severe');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dni" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "name" TEXT,
    "picture" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Autoevaluation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "riskLevel" "public"."RiskLevel" NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "daysSick" INTEGER NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Autoevaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Symptom" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "severity" "public"."SymptomSeverity" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Symptom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AutoevaluationSymptom" (
    "autoevaluationId" TEXT NOT NULL,
    "symptomId" TEXT NOT NULL,

    CONSTRAINT "AutoevaluationSymptom_pkey" PRIMARY KEY ("autoevaluationId","symptomId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_dni_key" ON "public"."User"("dni");

-- CreateIndex
CREATE INDEX "Autoevaluation_userId_createdAt_idx" ON "public"."Autoevaluation"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Autoevaluation_riskLevel_createdAt_idx" ON "public"."Autoevaluation"("riskLevel", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Symptom_code_key" ON "public"."Symptom"("code");

-- AddForeignKey
ALTER TABLE "public"."Autoevaluation" ADD CONSTRAINT "Autoevaluation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AutoevaluationSymptom" ADD CONSTRAINT "AutoevaluationSymptom_autoevaluationId_fkey" FOREIGN KEY ("autoevaluationId") REFERENCES "public"."Autoevaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AutoevaluationSymptom" ADD CONSTRAINT "AutoevaluationSymptom_symptomId_fkey" FOREIGN KEY ("symptomId") REFERENCES "public"."Symptom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
