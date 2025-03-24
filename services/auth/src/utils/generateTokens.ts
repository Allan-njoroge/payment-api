import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "./looger";
import prisma from "../services/prisma";
import { genSaltSync, hashSync } from "bcryptjs"

dotenv.config();

interface TokenResponse {
  accessToken: string,
  hashedRefreshToken: string
}

const generateTokens = async (userId: string): Promise<TokenResponse> => {
  if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    logger.error("JWT secrets are not configured");
  }
  
  //generate the access token
  const accessToken: string = jwt.sign(
    { id: userId },
    process.env.ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1h" }
  );

  // generate the refresh token
  const refreshToken: string = jwt.sign(
    { id: userId },
    process.env.REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );

  const salt = genSaltSync(10);
  const hashedRefreshToken = hashSync(refreshToken, salt);

  await prisma.refreshToken.create({
    data: {
      user_id: userId,
      refresh_token: hashedRefreshToken
    }
  })
  

  return { accessToken, hashedRefreshToken };
};

export default generateTokens;
