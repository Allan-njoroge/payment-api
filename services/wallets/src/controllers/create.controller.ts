import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";
import bcrypt from "bcryptjs";

export const createWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { type_id, pin, re_pin } = req.body;
    const user_id = (req as any).user.user_id
    let wallet_address: string;
    let doesWalletExists: any;

    const userWalletExists = await prisma.wallet.findFirst({
      where: {
        user_id,
        type_id,
      },
    });
    if (userWalletExists) {
      return res
        .status(409)
        .json({ message: "This wallet exists for this user" });
    }

    if (pin !== re_pin) {
      return res.status(400).json({ message: "PINs don't match" });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPin = bcrypt.hashSync(pin, salt);

    // Look if the id of the wallet type provided exists
    const typeValid = await prisma.walletType.findUnique({
      where: {
        id: type_id,
      },
    });
    if (!typeValid) {
      return res.status(404).json({ message: "Wallet type does not exist" });
    }

    do {
      wallet_address = generateWalletAddress();
      doesWalletExists = await prisma.wallet.findUnique({
        where: { wallet_address },
      });
    } while (doesWalletExists);

    await prisma.wallet.create({
      data: {
        wallet_address,
        amount: 0.0,
        pin: hashedPin,
        user_id,
        type_id,
      },
    });
    return res.status(201).json({ message: "wallet created successfully" });
  } catch (error: any) {
    logger.error("Error creating account", error);
    return res.status(500).json({ message: "Error creating account" });
  }
};

function generateWalletAddress(): string {
  const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let walletAddress: string = "".toLocaleLowerCase();

  for (let i = 0; i < 10; i++) {
    walletAddress += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return walletAddress;
}
