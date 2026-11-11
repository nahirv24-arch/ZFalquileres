-- CreateEnum
CREATE TYPE "Availability" AS ENUM ('AVAILABLE', 'RESERVED', 'RENTED', 'WITHDRAWN', 'UNCONFIRMED');

-- CreateEnum
CREATE TYPE "VerificationLevel" AS ENUM ('VERIFIED', 'ESTIMATED', 'NOT_AVAILABLE');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('AGENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "SyncStatus" AS ENUM ('RUNNING', 'SUCCEEDED', 'PARTIAL', 'FAILED');

-- CreateTable
CREATE TABLE "CatalogProperty" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "externalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "propertyType" TEXT,
    "neighborhood" TEXT,
    "addressDisplay" TEXT,
    "rentAmount" DECIMAL(14,2),
    "rentCurrency" VARCHAR(3),
    "bedrooms" INTEGER,
    "rooms" INTEGER,
    "coveredAreaM2" DECIMAL(10,2),
    "availability" "Availability" NOT NULL DEFAULT 'UNCONFIRMED',
    "publishable" BOOLEAN NOT NULL DEFAULT false,
    "rawPayload" JSONB,
    "lastSeenAt" TIMESTAMP(3),
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CatalogProperty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PropertyEnrichment" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "videoUrl" TEXT,
    "tourUrl" TEXT,
    "floorPlanUrl" TEXT,
    "measurementsLevel" "VerificationLevel" NOT NULL DEFAULT 'NOT_AVAILABLE',
    "measurementsDate" TIMESTAMP(3),
    "measurementsBy" TEXT,
    "notes" TEXT,
    "reviewedById" TEXT,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PropertyEnrichment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "passwordHash" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "changes" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SyncRun" (
    "id" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "status" "SyncStatus" NOT NULL DEFAULT 'RUNNING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "created" INTEGER NOT NULL DEFAULT 0,
    "updated" INTEGER NOT NULL DEFAULT 0,
    "removed" INTEGER NOT NULL DEFAULT 0,
    "errors" JSONB,

    CONSTRAINT "SyncRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "CatalogProperty_availability_publishable_idx" ON "CatalogProperty"("availability", "publishable");

-- CreateIndex
CREATE INDEX "CatalogProperty_neighborhood_idx" ON "CatalogProperty"("neighborhood");

-- CreateIndex
CREATE UNIQUE INDEX "CatalogProperty_source_externalId_key" ON "CatalogProperty"("source", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyEnrichment_propertyId_key" ON "PropertyEnrichment"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "PropertyEnrichment_slug_key" ON "PropertyEnrichment"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "AuditEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "AuditEvent"("createdAt");

-- CreateIndex
CREATE INDEX "SyncRun_source_startedAt_idx" ON "SyncRun"("source", "startedAt");

-- AddForeignKey
ALTER TABLE "PropertyEnrichment" ADD CONSTRAINT "PropertyEnrichment_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "CatalogProperty"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PropertyEnrichment" ADD CONSTRAINT "PropertyEnrichment_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
