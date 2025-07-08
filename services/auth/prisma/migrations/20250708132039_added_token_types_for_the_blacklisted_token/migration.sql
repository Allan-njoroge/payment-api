/*
  Warnings:

  - Added the required column `type` to the `BlacklistedToken` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blacklistedtoken` ADD COLUMN `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `type` ENUM('access', 'refresh') NOT NULL;
