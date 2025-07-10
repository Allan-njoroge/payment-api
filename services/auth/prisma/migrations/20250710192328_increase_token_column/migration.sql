-- DropIndex
DROP INDEX `RefreshToken_refresh_token_key` ON `RefreshToken`;

-- AlterTable
ALTER TABLE `RefreshToken` MODIFY `refresh_token` TEXT NOT NULL;
