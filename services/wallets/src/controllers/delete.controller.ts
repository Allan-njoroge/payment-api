import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";
import { compareSync } from "bcryptjs";

export const deleteWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req as any).user.user_id
    const {pin} = req.body
    const wallet_id = req.params.wallet_id

    if(!pin || !wallet_id) {
        return res.status(400).json({message: "PIN and wallet ID are required"})
    }

    // get wallet info from the database
    const wallet = await prisma.wallet.findUnique({
        where: { id: wallet_id },
        select: {amount: true, user_id: true, pin: true}
    })

    // Check if wallet is available
    if(!wallet) {
        return res.status(404).json({message: "Wallet does not exist"})
    }

    // check if the user id of the account matches the authenticated user
    if(userId != wallet.user_id) {
        return res.status(403).json({message: "You are not authorized to delete this wallet"})
    }

    // check if account balance is exactly equal to zero(0) to delete the account
    if(!wallet.amount.equals(0)) {
        return res.status(400).json({message: "Account balance must be 0"})
    }

    // compare the PIN to confirm the deletion
    if(!compareSync(pin, wallet.pin)) {
        return res.status(400).json({message: "Invalid PIN"})
    }

    // delete wallet from the database
    await prisma.wallet.delete({
        where: { id: wallet_id }
    })

    logger.info("Wallet deleted", wallet_id)
    return res.status(200).json({message: "Wallet deleted successfully"})
  } catch (error: any) {
    logger.error("Failed to delete wallet", error);
    return res.status(500).json({ message: "Failed to delete account" });
  }
};
