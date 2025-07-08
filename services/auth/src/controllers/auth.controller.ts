import { Request, Response } from "express";
import {
  LoginUserType,
  RegisterUserType,
  VerifyUserType,
} from "src/schema/auth.schema";
import { AuthService } from "src/services/auth.service";
import { generateTokens, logger, publishEvent } from "src/utils";
import { CustomError } from "src/utils/errors";

const authService = new AuthService();


/**
 * @function registerUser
 * @description Registers a new user and publishes a verification event
 * @route POST /api/auth/register
 */
export const registerUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: RegisterUserType = req.body;

  try {
    const { verificationCode, statusCode, message, user_id } =
      await authService.registerUser(body);

    await publishEvent("auth.verification", {
      email_address: body.emailAddress,
      phone_number: body.phoneNumber,
      verification_code: verificationCode,
    });

    logger.info(`User created successfully: ${body.emailAddress}`);
    return res.status(statusCode).json({ message: message, userId: user_id });
  } catch (error: any) {
    logger.error(`User registration failed: ${error}`);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }

    return res.status(500).json({ message: "Failed to verify account" });
  }
};


/**
 * @function verifyUser
 * @description Verifies a newly registered user's verification code
 * @route POST /api/auth/verify
 */
export const verifyUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: VerifyUserType = req.body;
  try {
    const { statusCode, message } = await authService.verifyUser(body);
    logger.info(`Successfully verified user: ${body.userId}`);
    return res.status(statusCode).json({ message });
  } catch (error: any) {
    logger.error(`Failed to verify user: ${body.userId}`);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * @function loginUser
 * @description Logs in a user and issues access/refresh tokens via cookies
 * @route POST /api/auth/login
 */
export const loginUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: LoginUserType = req.body;
  try {
    const { user, statusCode, message } = await authService.loginUser(body);
    const tokens = await generateTokens(user.id);

    logger.info(`Successfully logged in: ${body.emailAddress}`);
    return res
      .status(statusCode)
      .cookie("access_token", tokens.accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
      })
      .cookie("refresh_token", tokens.refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "none",
        path: "/",
      })
      .json({
        message,
        access_token: tokens.accessToken,
        user,
      });
  } catch (error: any) {
    logger.error(`Failed to login ${body.emailAddress}: ${error}`);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};


/**
 * @function logoutUser
 * @description Logs out a user by blacklisting their tokens
 * @route POST /api/auth/logout
 */
export type TokenPayloadType = {
  access_token: string;
  refresh_token: string;
};

export const logoutUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const cookies = req.cookies as Partial<TokenPayloadType>;
    const { access_token, refresh_token } = cookies;
    if (!access_token || !refresh_token)
      return res.status(400).json({ message: "Missing token" });

    const { message, statusCode } = await authService.logoutUser({
      access_token,
      refresh_token,
    });

    return res
      .clearCookie("access_token")
      .clearCookie("refresh_token")
      .status(statusCode)
      .json({ message });
  } catch (error: any) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
};
