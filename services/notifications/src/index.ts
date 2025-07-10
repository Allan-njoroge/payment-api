import express from "express";
import logger from "src/utils/logger";

import { connectToRabbitMQ, consumeEvent } from "src/services/rabbitmq";
import { sendVerificationCodeEvent } from "src/eventHandlers/sendVerification";
import { sendDepositSuccessEvent } from "src/eventHandlers/sendDepositSuccess";

import { PORT } from "src/config";
import { forgotPasswordEvent } from "./eventHandlers/forgotPassword";

const app = express();

const startServer = async () => {
  try {
    await connectToRabbitMQ();
    await consumeEvent("auth.verification", sendVerificationCodeEvent);
    await consumeEvent("auth.forgotPassword", forgotPasswordEvent)
    await consumeEvent("deposit.success", sendDepositSuccessEvent)

    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
};

startServer()