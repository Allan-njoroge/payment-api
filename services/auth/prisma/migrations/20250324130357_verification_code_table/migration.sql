-- CreateTable
CREATE TABLE `VerificationCode` (
    `verification_code` INTEGER NOT NULL,
    `email_address` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `VerificationCode_verification_code_key`(`verification_code`),
    UNIQUE INDEX `VerificationCode_email_address_key`(`email_address`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
