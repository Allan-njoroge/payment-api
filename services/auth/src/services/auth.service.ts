import prisma from "src/utils/prisma";
import {
  ForgotPasswordType,
  LoginUserType,
  LogoutUserType,
  RegisterUserType,
  ResetPasswordType,
  VerifyUserType,
} from "src/schema/auth.schema";
import bcrypt, { compareSync } from "bcryptjs";
import { CustomError } from "src/utils/errors";
import { TokenType } from "@prisma/client";

/**
 * AuthService handles all business logic related to user authentication.
 * It separates concerns from the controller and provides a clean service layer.
 */
export class AuthService {
  /**
   * Registers a new user in the system.
   * @param data - User registration details
   * @returns user ID and verification code to be sent via email/phone
   */
  async registerUser(data: RegisterUserType) {
    const { firstName, lastName, emailAddress, phoneNumber, password } = data;

    // check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email_address: emailAddress },
      select: { id: true },
    });
    if (existingUser) {
      throw new CustomError(409, "User already exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const [user, verificationCode] = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          first_name: firstName,
          last_name: lastName,
          email_address: emailAddress,
          phone_number: phoneNumber,
          password: hashedPassword,
        },
      });

      const code = Math.floor(100000 + Math.random() * 900000);
      await tx.verificationCode.create({
        data: {
          user_id: user.id,
          verification_code: code,
        },
      });

      return [user, code];
    });

    return {
      statusCode: 201,
      verificationCode,
      user_id: user.id,
      message: "Verification code sent to email",
    };
  }

  /**
   * Verifies a user with the provided code.
   * @param data - Contains userId and verificationCode
   * @returns Success message upon verification
   */
  async verifyUser(data: VerifyUserType) {
    const { userId, verificationCode } = data;

    const existingCode = await prisma.$transaction(async (tx) => {
      const code = await tx.verificationCode.delete({
        where: { user_id: userId, verification_code: verificationCode },
      });

      await tx.user.update({
        data: { is_active: true },
        where: { id: userId },
      });

      return code;
    });

    if (!existingCode) throw new CustomError(404, "Invalid verification code");

    return {
      message: "Verification successful. Please login",
      statusCode: 200,
    };
  }

  /**
   * Authenticates a user and returns public user data.
   * @param data - Contains email and password
   * @returns User object without password
   */
  async loginUser(data: LoginUserType) {
    const { emailAddress, password } = data;

    const user = await prisma.user.findUnique({
      where: { email_address: emailAddress },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email_address: true,
        phone_number: true,
        is_active: true,
        password: true,
      },
    });

    if (!user || !user.is_active)
      throw new CustomError(403, "No active account found");
    if (!compareSync(password, user.password))
      throw new CustomError(400, "Invalid email or password");

    const { password: _, ...userWithoutPassword } = user;

    return {
      statusCode: 200,
      message: "Login successful",
      user: userWithoutPassword,
    };
  }

  /**
   * Logs out the user by blacklisting their tokens.
   * @param data - Contains access and refresh tokens
   * @returns Confirmation message
   */
  async logoutUser(data: LogoutUserType) {
    const { accessToken, refreshToken } = data;
    await prisma.blacklistedToken.createMany({
      data: [
        { token: accessToken, type: TokenType.access },
        { token: refreshToken, type: TokenType.refresh },
      ],
    });

    return {
      message: "Logout successful",
      statusCode: 200,
    };
  }

  /**
   * Checks if the user email exists and creates a verification code.
   * @param data - Contain email
   * @returns status code, messae, user ID and the verification code
   */
  async forgotPassword(data: ForgotPasswordType) {
    const user = await prisma.user.findUnique({
      where: { email_address: data.emailAddress },
      select: { id: true, email_address: true },
    });

    if (!user) throw new CustomError(404, "User does not exist");

    const code = Math.floor(100000 + Math.random() * 900000);
    await prisma.verificationCode.create({
      data: {
        user_id: user.id,
        verification_code: code,
      },
    });

    return {
      statusCode: 200,
      verificationCode: code,
      user_id: user.id,
      message: "Verification code sent to email",
    };
  }

  /**
   * Sets the new password to a new one after resetting
   * @param data - Contains userId, verificationCode, password
   * @returns status code, messae, user ID and the verification code
   */
  async resetPassword(data: ResetPasswordType) {
    const { userId, verificationCode, password } = data;
    const code = await prisma.verificationCode.delete({
      where: {user_id: userId, verification_code: verificationCode},
    });

    if(!code) throw new CustomError(404, "Invalid verification code")

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    await prisma.user.update({
      data: {password: hashedPassword},
      where: {id: userId}
    })

    return {
      statusCode: 200,
      message: "Password updated successfully"
    }
  }
}
