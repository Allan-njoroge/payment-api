import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config()

export const validateToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      logger.warn("No access token found");
      return res.status(401).json({
        message: "Authentication required",
      });
    }

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string
    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
          logger.warn("Invalid token!");
          return res.status(429).json({
            message: "Invalid token!",
            success: false,
          });
        }
    
        (req as any).user = user;
        next();
      });
  } catch (error: any) {
    logger.error("Error validating token", error);
    return res.status(500).json({ error: "Error validating token" });
  }
};
