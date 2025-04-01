import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";
import { publishEvent } from "../services/rabbitmq";

export const verifyContact = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email_address, phone_number="" } = req.body;

    // Generate a verification code and  send it to the database
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await prisma.verificationCode.upsert({
      where: { email_address: email_address }, // Ensure email is unique
      update: {
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
      create: {
        email_address: email_address,
        verification_code: verificationCode,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // send the verification code to the notifications service using rabbitmq to send it to the user
    await publishEvent("auth.verification", {
      email_address,
      phone_number,
      verification_code: verificationCode,
    });

    // server response message and verification code
    logger.info(`Verification code sent to ${email_address}`);
    return res.status(200).json({
      message: `Verification code sent to ${email_address}`,
      // "verification code": verificationCode,
    });
  } catch (error: any) {
    logger.error("Failed to send verification code ", error);
    return res
      .status(500)
      .json({ error: "Failed to send verification code failed" });
  }
};
