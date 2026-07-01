/*
  Warnings:

  - A unique constraint covering the columns `[hostId,slug]` on the table `event_types` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `event_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `slug` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_types" ADD COLUMN     "slug" TEXT NOT NULL,
ALTER COLUMN "description" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "timezone" TEXT NOT NULL DEFAULT 'UTC';

-- CreateIndex
CREATE UNIQUE INDEX "event_types_hostId_slug_key" ON "event_types"("hostId", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "users_slug_key" ON "users"("slug");
