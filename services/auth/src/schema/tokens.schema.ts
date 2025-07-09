import { z, TypeOf, object } from "zod";

export const validateTokenSchema = object({
  body: object({
    token: z.string().trim().min(1, { message: "Token is required" }),
    type: z.string().trim().min(1, { message: "Token type is required" }),
  }),
});

export const refreshTokenSchema = object({
  body: object({
    token: z.string().trim().min(1, { message: "Token is required" }),
    userId: z.string().trim().min(1, {message: "User ID is required"})
  }),
});

export type ValidateTokenType = TypeOf<typeof validateTokenSchema>["body"];
export type RefreshTokenType = TypeOf<typeof refreshTokenSchema>["body"];
