import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import logger from "./looger";
import prisma from "../services/prisma";
import bcrypt, { genSaltSync } from "bcryptjs"

dotenv.config();

const generateTokens = (userId: string) => {
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

  const salt = bcrypt.genSaltSync(10);
  const hashedRefreshToken = bcrypt.hashSync(refreshToken, salt);
  

  return { accessToken, hashedRefreshToken };
};

export default generateTokens;
