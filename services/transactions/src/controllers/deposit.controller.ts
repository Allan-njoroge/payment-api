import { Request, Response } from "express";
import logger from "../utils/logger";
import { publishEvent } from "../services/rabbitmq";
import prisma from "../services/prisma";

export const depositAmount = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      depositor_name,
      depositor_email_address,
      depositor_phone_number,
      wallet_address,
      amount,
      reference,
    } = req.body;
    if (!amount) {
      return res.status(400).json({ message: "No amount has been entered" });
    }

    const invalidReference = await prisma.deposit.findUnique({
      where: { reference },
    });
    if (invalidReference) {
      return res
        .status(409)
        .json({
          message: "Invalid transaction. Reference number already exist",
        });
    }

    const { id, ...depositDetails } = await prisma.deposit.create({
      data: {
        wallet_address,
        amount,
        reference,
      },
    });

    // send the deposit details to the wallet service
    await publishEvent("deposit.created", {
      deposit_details: {
        depositor_name,
        depositor_email_address,
        depositor_phone_number,
        wallet_address: depositDetails.wallet_address,
        reference: depositDetails.reference,
        date: depositDetails.date,
        amount: depositDetails.amount,
      },
    });

    return res
      .status(200)
      .json({ message: "Deposit has been made successfully" });
  } catch (error: any) {
    logger.error("Failed to deposit amount", error);
    return res.status(500).json({ message: "Failed to deposit amount" });
  }
};
