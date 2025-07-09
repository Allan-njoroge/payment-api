import dotenv from "dotenv"

dotenv.config()

export const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

export const REFRESH_TOKEN_ENCRYPTION_KEY = process.env.REFRESH_TOKEN_ENCRYPTION_KEY
export const IV_LENGTH = process.env.IV_LENGTH