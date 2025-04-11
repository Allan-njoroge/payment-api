import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";

export const getWalletById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const wallet_id = req.params.wallet_id;
    const userId = (req as any).user.user_id;

    if (!wallet_id) {
      return res.status(400).json({ message: "Wallet ID is missing" });
    }

    const wallet = await prisma.wallet.findUnique({
      where: {
        id: wallet_id,
      },
      select: {
        id: true,
        user_id: true,
        wallet_address: true,
        amount: true,
        type_id: true,
        created_at: true,
      },
    });

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    if (userId !== wallet.user_id) {
      return res
        .status(400)
        .json({ message: "You are not authorized to access this wallet" });
    }

    const { user_id, ...walletInfo } = wallet;

    return res.status(200).json({ message: walletInfo });
  } catch (error: any) {
    logger.error("Error getting wallet", error);
    return res.status(500).json({ message: "Error getting wallet infomation" });
  }
};
