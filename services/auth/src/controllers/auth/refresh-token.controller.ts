import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import logger from "../../utils/logger";
import prisma from "../../utils/prisma";
import { generateTokens } from "../../utils/tokens";

export const refreshToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { refresh_token } = req.cookies;
    if (!refresh_token) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const blacklisted = await prisma.blacklistedToken.findFirst({
      where: {token: refresh_token}
    })
    if (blacklisted) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Verify the refresh token
    let payload;
    try {
      payload = jwt.verify(
        refresh_token,
        process.env.REFRESH_TOKEN_SECRET as string
      ) as JwtPayload;
    } catch (error) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    //Fetch the stored hashed refresh token from the database
    const storedToken = await prisma.refreshToken.findUnique({
      where: { user_id: payload.id },
    });

    if (!storedToken) {
      return res.status(404).json({ message: "No refresh token found" });
    }

    // Generate new access and refresh tokens (handles hashing & updating DB)
    const newTokens = await generateTokens(payload.id);

    await prisma.blacklistedToken.create({
      data: { token: refresh_token, type: "refresh" },
    });

    // Set new refresh token in HTTP-Only Cookie
    return res
      .status(200)
      .cookie("refresh_token", newTokens.refreshToken, {
        httpOnly: true,
        secure: false, // Change to `false` in dev
        sameSite: "strict",
        path: "/",
      })
      .json({ access_token: newTokens.accessToken });
  } catch (error: any) {
    logger.error("Failed to refresh token", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
