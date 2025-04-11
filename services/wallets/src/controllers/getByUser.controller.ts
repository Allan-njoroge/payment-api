import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";

export const getWalletsByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user_id = (req as any).user.user_id;
    const userWallets = await prisma.wallet.findMany({
      where: {
        user_id,
      },
    });

    if (!userWallets) {
      return res.status(404).json({ message: "User has no wallets" });
    }

    const userWalletsInfo = userWallets.map(
      ({ user_id, pin, ...walletInfo }) => walletInfo
    );
    return res.status(200).json({ wallets: userWalletsInfo });
  } catch (error: any) {
    logger.error("Failed to fetch accounts: ", error);
    return res.status(500).json({ message: "Failed to fetch accounts" });
  }
};
