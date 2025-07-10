import { z, TypeOf, object } from "zod";

export const registerUserSchema = object({
  body: object({
    firstName: z
      .string()
      .trim()
      .min(1, { message: "First name is required" })
      .toLowerCase(),
    lastName: z
      .string()
      .trim()
      .min(1, { message: "Last name is required" })
      .toLowerCase(),
    emailAddress: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" })
      .toLowerCase(),
    phoneNumber: z
      .string()
      .regex(/^\d+$/, { message: "Phone must be a number" })
      .min(10, { message: "Phone number must be atleast 10" })
      .optional(),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" }),
    rePassword: z.string(),
  }).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePaassword"],
  }),
});

export const verifyUserSchema = object({
  body: object({
    userId: z.string().trim().min(1, { message: "User id is missing" }),
    verificationCode: z.number(),
  }),
});

export const loginUserSchema = object({
  body: object({
    emailAddress: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" })
      .toLowerCase(),
    password: z.string().min(1, { message: "Password is required" }),
  }),
});

export const logoutUserSchema = object({
  body: object({
    accessToken: z
      .string()
      .trim()
      .min(1, { message: "access token is required" }),
    refreshToken: z
      .string()
      .trim()
      .min(1, { message: "refresh token is required" }),
  }),
});

export const forgotPasswordSchema = object({
  body: object({
    emailAddress: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email format" })
      .toLowerCase(),
  }),
});

export const resetPasswordSchema = object({
  body: object({
    userId: z.string().trim().min(1, { message: "Missing user ID" }),
    verificationCode: z.number(),
    password: z
      .string()
      .min(8, { message: "Password must be atleast 8 characters" }),
    rePassword: z.string(),
  }).refine((data) => data.password === data.rePassword, {
    message: "Passwords do not match",
    path: ["rePaassword"],
  }),
});

export type RegisterUserType = TypeOf<typeof registerUserSchema>["body"];
export type VerifyUserType = TypeOf<typeof verifyUserSchema>["body"];
export type LoginUserType = TypeOf<typeof loginUserSchema>["body"];
export type LogoutUserType = TypeOf<typeof logoutUserSchema>["body"];
export type ForgotPasswordType = TypeOf<typeof forgotPasswordSchema>["body"];
export type ResetPasswordType = TypeOf<typeof resetPasswordSchema>["body"];
