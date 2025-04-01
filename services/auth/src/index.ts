import express from "express"
import dotenv from "dotenv"
import logger from "./utils/logger"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes"

import { connectToRabbitMQ } from "./services/rabbitmq"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())

// routes definition
app.use('/api/auth', authRoutes)


connectToRabbitMQ()

const PORT = process.env.PORT || 5001
app.listen(PORT,() => {
    logger.info(`server is running in http://localhost:${PORT}`)
})