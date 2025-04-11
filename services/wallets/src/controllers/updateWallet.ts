import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

export const updateWallet = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const userId = (req as any).user.user_id;
    const wallet_id = req.params.wallet_id;
    const { amount, pin, new_pin, re_new_pin } = req.body;

    const wallet = await prisma.wallet.findUnique({
      where: { id: wallet_id },
    });

    // check if wallet exists in the database
    if (!wallet) {
      return res.status(400).json({ message: "This wallet does not exist" });
    }

    // check if user id from the token matches the user id for wallet
    if (userId !== wallet.user_id) {
      return res
        .status(401)
        .json({ message: "You are not authorized to update this wallet" });
    }

    // If no pin only thing that can be updated is amount
    if (!pin) {
      await prisma.wallet.update({
        data: { amount },
        where: { id: wallet_id },
      });
      return res
        .status(200)
        .json({ message: "Balance has been updated successfully" });
    }

    // check if new PIN and confirm new PIN is in the request
    if (!new_pin || !re_new_pin) {
      return res
        .status(400)
        .json({ message: "New PIN and confirm new PIN are required" });
    }

    // check in new PIN and confirm new PIN are the same
    if (new_pin !== re_new_pin) {
      return res
        .status(401)
        .json({ message: "New PIN and conform new PIN do not match" });
    }

    // Update the PIN
    if (!compareSync(pin, wallet.pin)) {
      return res.status(403).json({ message: "Incorrect PIN" });
    }

    // hash the pin
    const salt = genSaltSync(10);
    const hashedPin = hashSync(new_pin, salt);
    await prisma.wallet.update({
      data: { pin: hashedPin },
      where: { id: wallet_id },
    });

    return res.status(200).json({ message: "PIN has been changed successfully" });
  } catch (error: any) {
    logger.error("Error updating wallet", error);
    return res.status(500).json({ error: "Error updating wallet" });
  }
};
