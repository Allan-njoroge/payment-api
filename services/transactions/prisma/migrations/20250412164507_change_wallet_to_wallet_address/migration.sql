/*
  Warnings:

  - You are about to drop the column `wallet` on the `deposit` table. All the data in the column will be lost.
  - You are about to drop the column `wallet` on the `withdrawal` table. All the data in the column will be lost.
  - Added the required column `wallet_address` to the `Deposit` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wallet_address` to the `Withdrawal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `deposit` DROP COLUMN `wallet`,
    ADD COLUMN `wallet_address` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `withdrawal` DROP COLUMN `wallet`,
    ADD COLUMN `wallet_address` VARCHAR(191) NOT NULL;
