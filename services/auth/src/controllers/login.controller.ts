import { Response, Request } from "express";
import { compareSync } from "bcryptjs";
import logger from "../utils/logger";
import prisma from "../services/prisma";
import {generateTokens} from "../utils/tokens";

interface LoginDetails {
  email_address: string;
  password: string;
}

export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { email_address, password }: LoginDetails = req.body;
    const user = await prisma.user.findUnique({
      where: { email_address },
    });

    if(!user || !compareSync(password, user.password)) {
        return res.status(404).json({ "message": "Invalid email or password" })
    }

    const tokens = await generateTokens(user.id)
    const { password: _, ...userDetails } = user

    const wallets = await prisma.wallet.findMany({
        where: { user_id: user.id },
        select: { wallet_address: true, amount: true }
    })

    return res
    .status(200)
    .cookie("refresh_token", tokens.refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "none",
      path: "/",
    })
    .json({
      message: "Login succesfully",
      access_token: tokens.accessToken,
      user: userDetails,
      wallets
    });

  } catch (error: any) {
    logger.error("Failed to login user ", error);
    return res.status(500).json("Login Failed, try again");
  }
};
