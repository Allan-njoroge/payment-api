import { Response, Request } from "express";
import logger from "../../utils/logger";
import prisma from "../../utils/prisma";

export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user_id = req.params.userId;

    const userDetails = await prisma.user.findUnique({
      where: { id: user_id },
      select: {
        first_name: true,
        last_name: true,
        email_address: true,
        phone_number: true,
      },
    });

    if (!userDetails) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "User found",
      user: userDetails,
    });
  } catch (error: any) {
    logger.error("Failed to fetch user", error);
    return res.status(500).json({ message: "Failed to fetch user" });
  }
};
