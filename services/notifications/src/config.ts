import dotenv from "dotenv"

dotenv.config()

export const PORT = process.env.PORT

export const NODE_ENV = process.env.NODE_ENV

export const AFRICAS_TALKING_API_KEY = process.env.AFRICAS_TALKING_API_KEY
export const AFRICAS_TALKING_USERNAME = process.env.AFRICAS_TALKING_USERNAME

export const EMAIL_SERVICE = process.env.EMAIL_SERVICE
export const EMAIL_HOST = process.env.EMAIL_HOST
export const EMAIL_PORT = process.env.EMAIL_PORT
export const EMAIL_NAME = process.env.EMAIL_NAME
export const EMAIL_USERNAME = process.env.EMAIL_USERNAME
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD

export const RABBITMQ_URL = process.env.RABBITMQ_URL