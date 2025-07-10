import amqp, { Channel } from "amqplib";
import logger from "../utils/logger";
import dotenv from "dotenv";
dotenv.config();

let connection = null;
let channel: Channel | null = null;

const EXCHANGE_NAME = "payment_api";

export const connectToRabbitMQ = async (): Promise<Channel | null> => {
  try {
    const rabbitmqUrl = process.env.RABBITMQ_URL;
    if (!rabbitmqUrl) {
      logger.error("RABBITMQ_URL is not defined in the environment variables");
      return null;
    }

    connection = await amqp.connect(rabbitmqUrl);
    channel = await connection.createChannel();

    await channel.assertExchange(EXCHANGE_NAME, "topic", { durable: false });
    logger.info("Connected to RabbitMQ");

    return channel;
  } catch (error) {
    logger.error("Error connecting to RabbitMQ", error);
    return null;
  }
};

export const publishEvent = async (
  routingKey: string,
  message: any
): Promise<void> => {
  if (!channel) {
    await connectToRabbitMQ();
  }

  channel?.publish(
    EXCHANGE_NAME,
    routingKey,
    Buffer.from(JSON.stringify(message))
  );
  logger.info(`Event published: ${routingKey}`);
};
