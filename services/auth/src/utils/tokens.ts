import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "./logger";
import prisma from "../services/prisma";
import { compareSync, genSaltSync, hashSync } from "bcryptjs";

dotenv.config();

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = async (
  user_id: string
): Promise<TokenResponse> => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    logger.error("JWT secrets are not configured");
  }

  //generate the access token
  const accessToken: string = jwt.sign(
    { id: user_id },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1h" }
  );

  // generate the refresh token
  const refreshToken: string = jwt.sign(
    { id: user_id },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );

  const salt = genSaltSync(10);
  const hashedRefreshToken = hashSync(refreshToken, salt);

  // check for existing tokens
  await prisma.refreshToken.upsert({
    where: { user_id },
    update: { refresh_token: hashedRefreshToken },
    create: { user_id, refresh_token: hashedRefreshToken },
  });

  return { accessToken, refreshToken };
};
