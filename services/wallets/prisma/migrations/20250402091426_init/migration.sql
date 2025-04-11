-- CreateTable
CREATE TABLE `Wallet` (
    `id` VARCHAR(191) NOT NULL,
    `wallet_address` VARCHAR(191) NOT NULL,
    `amount` DECIMAL(50, 2) NOT NULL DEFAULT 0.0,
    `pin` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `type_id` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Wallet_wallet_address_key`(`wallet_address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `WalletType` (
    `id` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Wallet` ADD CONSTRAINT `Wallet_type_id_fkey` FOREIGN KEY (`type_id`) REFERENCES `WalletType`(`id`) ON DELETE NO ACTION ON UPDATE CASCADE;
