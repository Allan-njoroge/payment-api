import { Request, Response } from "express";
import logger from "../utils/looger";
import prisma from "../services/prisma";


export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const {
      first_name,
      last_name,
      email_address,
      phone_number,
      password,
      re_password,
    } = req.body;

    // check for existing user
    const existingUser = await prisma.user.findUnique({
      where: {
        email_address: email_address,
      },
    });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Check if passwords match
    if (password != re_password) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    // Generate a verification code and  send it to the database
    const verificationCode = Math.floor(100000 + Math.random() * 900000);
    await prisma.verificationCode.create({
      data: {
        verification_code: verificationCode,
        email_address: email_address,
        expires_at: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    // server response message and verification code
    logger.info(`Verification code sent to ${email_address}`);
    return res.status(200).json({
      message: `Verification code sent to ${email_address}`,
      "verification code": verificationCode,
    });
  } catch (error: any) {
    logger.error("Registration Error Occurred ", error);
    return res
      .status(500)
      .json({ error: "Regsitration failed, something went wrong " });
  }
};
