import { NextFunction, Request, Response } from "express";

const logger = require("../utils/logger");

export const authenticateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const user_id = req.headers["x-user-id"];

  if (!user_id) {
    logger.warn(`Access attempted without user ID`);
    res.status(401).json({
      success: false,
      message: "Authencation required! Please login to continue",
    });
    return
  }

  (req as any).user = { user_id };
  next();
};

