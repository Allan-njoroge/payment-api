import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";
import { compareSync } from "bcryptjs";

export const validatePin = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {wallet_address, pin} = req.body

    const wallet = await prisma.wallet.findUnique({
        where: {wallet_address},
        select: {pin: true}
    })

    if(!pin || !wallet_address) {
        return res.status(400).json({message: "Missing wallet address or PIN"})
    }

    // check if wallet exists
    if(!wallet) {
        return res.status(404).json({message: "Wallet not found"})
    }

    // check if the PIN matches
    if(!compareSync(pin, wallet.pin)){
        return res.status(403).json({message: "Invalid wallet PIN"})
    }

    return res.status(200).json({message: "Verification sucessfull"})
  } catch (error: any) {
    logger.error("Failed to validate PIN", error);
    return res.status(500).json({ message: "Failed to validate PIN" });
  }
};
