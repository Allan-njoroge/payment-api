import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

import { sendSMS } from "./services/message.service";
import { sendEmail } from "./services/email.service";
import { connectToRabbitMQ, consumeEvent } from "./services/rabbitmq";
import { sendVerificationCodeEvent } from "./eventHandlers/sendVerification";
import { sendDepositSuccessEvent } from "./eventHandlers/sendDepositSuccess";

const app = express();
dotenv.config();

const startServer = async () => {
  try {
    await connectToRabbitMQ();
    await consumeEvent("auth.verification", sendVerificationCodeEvent);
    await consumeEvent("deposit.success", sendDepositSuccessEvent)

    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
};

startServer()