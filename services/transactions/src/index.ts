import express, { Application } from "express"
import dotenv from "dotenv"
import logger from "./utils/logger"
import { authenticateRequest } from "./middleware/authenticateRequest"
import { connectToRabbitMQ } from "./services/rabbitmq"
// import routes
import transactionRoutes from "./routes/transactions.routes"


const app: Application = express()
app.use(express.json())
dotenv.config()

connectToRabbitMQ()

// app.get("/api/transactions", authenticateRequest,(req, res)=> {
//     const user = (req as any).user.user_id
//     res.json({message: "hello transactions", user})
// })

app.use("/api/transactions", transactionRoutes)

const PORT = process.env.PORT || 5004
app.listen(PORT, ()=> {
    logger.info(`server is running in http://localhost:${PORT}`);
})