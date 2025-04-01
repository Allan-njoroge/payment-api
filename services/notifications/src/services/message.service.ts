import dotenv from "dotenv";
import logger from "../utils/logger";
import { africastalking } from "../config/message.config";
dotenv.config();


type MessageTypes = {
  phoneNumber: string,
  message: string
}

export const sendSMS = async ({phoneNumber, message}: MessageTypes) => {
  try {
    const result = await africastalking.SMS.send({
        to: phoneNumber,
        message: message,
        from: ""
    });
    logger.info("Message result: ", result)
  } catch (error: any) {
    logger.error("Error sending message", error);
  }
};
