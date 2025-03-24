import express from "express"
import dotenv from "dotenv"
import logger from "./utils/looger"
import cookieParser from "cookie-parser"

import authRoutes from "./routes/auth.routes"

const app = express()
dotenv.config()

app.use(express.json())
app.use(cookieParser())

// routes definition
app.use('/api/auth', authRoutes)


const PORT = process.env.PORT || 5001
app.listen(PORT,() => {
    logger.info(`server is running in http://localhost:${PORT}`)
})