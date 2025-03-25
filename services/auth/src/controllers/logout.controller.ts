import { Request, Response } from "express";
import logger from "../utils/looger";
import prisma from "../services/prisma";

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { refresh_token } = req.cookies;
    await prisma.blacklistedToken.create({
      data: { token: refresh_token, type: "refresh" },
    });
    return res.clearCookie(refresh_token);
  } catch (error: any) {
    logger.error("Logout failed", error);
    return res.status(500).json({ error: "Logout failed" });
  }
};
