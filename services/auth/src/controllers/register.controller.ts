import { Request, Response } from "express";
import logger from "../utils/logger";
import prisma from "../services/prisma";
import bcrypt from "bcryptjs";
import { generateTokens } from "../utils/tokens";

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
      verification_code,
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
    // compare the two passwords
    if (password != re_password) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const storedCode = await prisma.verificationCode.findUnique({
      where: {
        email_address: email_address,
      },
    });

    if (!storedCode) {
      return res
        .status(404)
        .json({ message: "No verification code for this user" });
    }

    if (storedCode.verification_code != verification_code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (storedCode.expires_at < new Date()) {
      deleteVerificationCode(verification_code, email_address);
      return res
        .status(400)
        .json({ message: "The verification code is already expired" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = await prisma.user.create({
      data: {
        first_name,
        last_name,
        email_address,
        phone_number,
        password: hashedPassword,
      },
    });
    const { password: string, ...userWithoutPassword } = newUser;

    // generate the access token an refresh token
    const tokens = await generateTokens(newUser.id);

    deleteVerificationCode(verification_code, email_address); // delete the verification code in the database
    logger.info(`User registered successfully: ${email_address}`); // log the user success message
    return res
      .status(201)
      .cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
      })
      .json({
        message: "User created succesfully",
        access_token: tokens.accessToken,
        user: userWithoutPassword,
      });
  } catch (error: any) {
    logger.error("Account verification failed ", error);
    return res.status(500).json({ error: "Failed to verify account" });
  }
};

// delete verification code function
async function deleteVerificationCode(
  verification_code: number,
  email_address: string
): Promise<void> {
  await prisma.verificationCode.delete({
    where: {
      verification_code,
      email_address,
    },
  });
}

/*
 * ==========
 * This function generates a wallet address
 * ==========
 */
function generateWalletAddress(): string {
  const chars: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let walletAddress: string = "".toLocaleLowerCase();

  for (let i = 0; i < 10; i++) {
    walletAddress += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return walletAddress;
}
