import express from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

import { sendSMS } from "./services/message.service";
import { sendEmail } from "./services/email.service";
import { connectToRabbitMQ, consumeEvent } from "./services/rabbitmq";
import { sendVerificationCodeEvent } from "./eventHandlers/sendVerification";

const app = express();
dotenv.config();


const welcomeMessage = () => {
  let contact_details = [
    { phone: "+254776744754", name: "Muchai Thiaka" },
    { phone: "+254700056642", name: "Allan Njoroge" },
  ];

  contact_details.map((contact) => {
    let message = `Hello ${contact.name},
        Welcome to Payment API
        `;
    sendSMS({
      phoneNumber: contact.phone,
      message,
    });
  });
};

// welcomeMessage()

const startServer = async () => {
  try {
    await connectToRabbitMQ();
    await consumeEvent("auth.verification", sendVerificationCodeEvent);

    const PORT = process.env.PORT || 5002;
    app.listen(PORT, () => {
      logger.info(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Failed to start the server:", error);
  }
};

startServer()