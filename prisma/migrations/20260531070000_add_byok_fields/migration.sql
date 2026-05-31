-- AlterTable
ALTER TABLE "user" ADD COLUMN "encryptedGeminiKey" TEXT;
ALTER TABLE "user" ADD COLUMN "geminiKeyUpdatedAt" TIMESTAMP(3);
