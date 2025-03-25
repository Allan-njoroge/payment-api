/*
  Warnings:

  - You are about to drop the `blacklistedtokens` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `blacklistedtokens`;

-- CreateTable
CREATE TABLE `BlacklistedToken` (
    `id` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
