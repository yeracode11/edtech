-- CreateEnum
CREATE TYPE "LessonType" AS ENUM ('VIDEO', 'TEXT', 'QUIZ');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "priceInstallment" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "lessons" ADD COLUMN     "content" TEXT,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "type" "LessonType" NOT NULL DEFAULT 'VIDEO',
ADD COLUMN     "videoUrl" TEXT;
