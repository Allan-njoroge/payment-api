import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import prisma from "./prisma";
import logger from "./logger"
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "src/config";
import { CustomError } from "./errors";
import { TokenType } from "@prisma/client";
import { encrypt } from "./crypto";

dotenv.config();

interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

export const generateTokens = async (
  user_id: string
): Promise<TokenResponse> => {
  if (!ACCESS_TOKEN_SECRET || !REFRESH_TOKEN_SECRET) {
    logger.error("JWT secrets are not configured");
    throw new CustomError(500, "Missing JWT configuration")
  }

  //generate the access token
  const accessToken: string = jwt.sign(
    { id: user_id },
    ACCESS_TOKEN_SECRET as string,
    { expiresIn: "1h" }
  );

  // generate the refresh token
  const refreshToken: string = jwt.sign(
    { id: user_id },
    REFRESH_TOKEN_SECRET as string,
    { expiresIn: "1d" }
  );

  const encryptedRefreshToken = encrypt(refreshToken)

  // check for existing tokens
  await prisma.refreshToken.upsert({
    where: { user_id },
    update: { refresh_token: encryptedRefreshToken },
    create: { user_id, refresh_token: encryptedRefreshToken },
  });

  return { accessToken, refreshToken };
};


export const resolveJWTSecretAndType = (type: string) => {
  switch (type) {
    case "access":
      return {
        jwt_secret:ACCESS_TOKEN_SECRET as string, 
        type: TokenType.access
      }
    case "refresh":
      return {
        jwt_secret: REFRESH_TOKEN_SECRET as string,
        type: TokenType.refresh
      }
    default:
      throw new CustomError(400, "Invalid token type")
  }
}

// verify jwt tokens
export const verifyJWT = (token: string, jwt_secret: string): Promise<any> => {
  if(!token) throw new CustomError(400, "Missing token")
  if(!jwt_secret) throw new CustomError(500, "Missing JWT secret")

  return new Promise((resolve, reject) => {
    jwt.verify(token, jwt_secret, (error, decoded) => {
      logger.error(`Decode token error: ${error}`)
      if(error) return reject("Invalid or expired token")
      return resolve({decoded})
    })
  })
}
