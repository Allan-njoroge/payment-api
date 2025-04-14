import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";

export const getWalletByAdress = async (req: Request, res: Response) => {
  try {
    const wallet_address = req.params.wallet_address;

    // check if wallet address fieldd is missing
    if (!wallet_address) {
      return res.status(400).json({ message: "Wallet field is empty" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: { wallet_address },
      select: {
        id: true,
        wallet_address: true,
        user_id: true,
        walletType: { select: { type: true } },
      },
    });

    // check if wallet exists
    if(!wallet) {
      return res.status(404).json({message: "Wallet not found"})
    }

    return res.status(200).json({ message: "Wallet found", wallet: wallet });
  } catch (error: any) {
    logger.error("Error gatting wallet", error);
    return res.status(500).json({ message: "Error getting wallet" });
  }
};
