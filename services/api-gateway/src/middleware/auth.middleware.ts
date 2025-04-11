import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

export const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers["authorization"];
    let token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Authentication required" });
      return;
    }

    const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET as string;

    try {
      // Verify access token
      const user = jwt.verify(token, ACCESS_TOKEN_SECRET) as JwtPayload;
      req.headers["x-user-id"] = user.id;
      (req as any).user = user;
      return next(); // Continue request
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        logger.warn("Access token expired, attempting refresh...");
        return await refreshTokenAndRetry(req, res, next);
      }

      res.status(403).json({ message: "Invalid token" });
      return;
    }
  } catch (error: any) {
    logger.error("Error validating token", error);
    res.status(500).json({ error: "Error validating token" });
    return;
  }
};

// Attempt to refresh the tokens
const refreshTokenAndRetry = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const refreshResponse = await axios.post(
      `${process.env.AUTH_SERVICE_URL}/api/auth/refresh-token`,
      {},
      {
        headers: { Cookie: req.headers.cookie || "" },
        withCredentials: true,
      }
    );

    const { access_token } = refreshResponse.data;
    if (!access_token) {
      res.status(401).json({ message: "Refresh failed" });
      return;
    }

    req.headers["authorization"] = `Bearer ${access_token}`;

    const user = jwt.verify(
      access_token,
      process.env.ACCESS_TOKEN_SECRET as string
    ) as JwtPayload;
    (req as any).user = user;

    return next();
  } catch (error: any) {
    logger.error("Token refresh failed", error);
    res.status(401).json({ message: "Session expired, please log in again" });
    return;
  }
};
