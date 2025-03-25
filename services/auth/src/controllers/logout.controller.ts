import { Request, Response } from "express";
import logger from "../utils/looger";
import prisma from "../services/prisma";

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { refresh_token } = req.cookies;
    
    // Ensure token exists
    if (!refresh_token) {
      return res.status(400).json({ error: "No refresh token provided" });
    }

    // Blacklist the token
    await prisma.blacklistedToken.create({
      data: { token: refresh_token, type: "refresh" },
    });

    // Clear the cookie properly
    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: false, // Change to true in production
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error: any) {
    logger.error("Logout failed", error);
    return res.status(500).json({ error: "Logout failed" });
  }
};
