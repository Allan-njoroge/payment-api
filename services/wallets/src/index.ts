import express, { Application } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";
import { connectToRabbitMQ, consumeEvent } from "./services/rabbitmq";
// import routes here
import walletRoutes from "./routes/wallets.routes"
import { depositAmount } from "./eventHandlers/depositAmount";


const app: Application = express();
app.use(express.json())
dotenv.config();

app.use("/api/wallets", walletRoutes)


const startServer = async () => {
  try {
    await connectToRabbitMQ();
    await consumeEvent("deposit.created", depositAmount);

    
    const PORT = process.env.PORT || 5003;
    app.listen(PORT, () => {
      logger.info(`server is running in http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
};

startServer()