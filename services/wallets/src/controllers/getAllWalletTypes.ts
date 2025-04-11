import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";

export const getAllWalletTypes = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const types = await prisma.walletType.findMany();

    if (!types || types.length <= 0) {
      return res.status(404).json({ message: "No wallets types found" });
    }

    logger.info("Wallet types retrieved");
    return res.status(200).json({ wallet_types: types });
  } catch (error: any) {
    logger.error("Failed to get wallet type", error);
    return res.status(500).json({ message: "Failed to get wallet type" });
  }
};
