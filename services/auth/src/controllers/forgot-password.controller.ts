import { Request, Response } from "express";
import prisma from "../services/prisma";
import logger from "../utils/logger";
import bcrypt from "bcryptjs";

export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email_address, verification_code, new_password, re_new_password } =
      req.body;

    const user = await prisma.user.findUnique({
      where: { email_address },
    });
    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // retrieve the verification code and validate it
    const storedCode = await prisma.verificationCode.findUnique({
      where: { email_address },
    });
    if (!storedCode) {
      return res.status(404).json({ message: "No verification code found" });
    }
    if (storedCode.verification_code != verification_code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new_password != re_new_password) {
      return res.status(400).json({ message: "Password don't match" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(new_password, salt);

    await prisma.user.update({
      where: { email_address },
      data: { password: hashedPassword },
    });

    await prisma.verificationCode.delete({
      where: { email_address },
    });

    logger.info(`User ${email_address} changed password`);
    return res.status(200).json({ message: "Password updated successfully" });
  } catch (error: any) {
    logger.error("Failed to change password", error);
    return res.status(500).json({ message: "Failed to change password" });
  }
};
