import { Request, Response } from "express";
import {
  ForgotPasswordType,
  LoginUserType,
  LogoutUserType,
  RegisterUserType,
  ResetPasswordType,
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
    return res.status(statusCode).json({
      message,
      user,
      tokens: {
        access: tokens.accessToken,
        refresh: tokens.refreshToken,
      },
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
export const logoutUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { accessToken, refreshToken }: LogoutUserType = req.body;

    const { message, statusCode } = await authService.logoutUser({
      accessToken,
      refreshToken,
    });

    return res.status(statusCode).json({ message });
  } catch (error: any) {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function forgotPassword
 * @description Enables user to request for new password if they can't remember and publishes a verification code
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { emailAddress }: ForgotPasswordType = req.body;
  try {
    const { verificationCode, message, statusCode } =
      await authService.forgotPassword({ emailAddress });

    await publishEvent("auth.verification", {
      email_address: emailAddress,
      verification_code: verificationCode,
    });

    return res.status(statusCode).json({ message });
  } catch (error: any) {
    logger.error(`Failed to request request password change: ${emailAddress}`);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

/**
 * @function resetPassword
 * @description Allow user to set new password after verification code has been sent to email
 * @route POST /api/auth/reset-password
 */
export const resetPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const body: ResetPasswordType = req.body;
  try {
    const { message, statusCode } = await authService.resetPassword(body);
    return res.status(statusCode).json({ message });
  } catch (error: any) {
    logger.error(`Failed to reset password: ${body.userId}`);
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
