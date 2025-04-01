import amqp, { Connection, Channel } from "amqplib";
import logger from "../utils/logger";
import dotenv from "dotenv";
dotenv.config();

let connection = null;
let channel: Channel | null = null;

const EXCHANGE_NAME = "auth_notification";

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

export const consumeEvent = async (routingKey: string, callback: any) => {
  if (!channel) {
    await connectToRabbitMQ();
  }

  if (!channel) {
    logger.error("RabbitMQ channel is not available");
    throw new Error("RabbitMQ channel is not available")
  }

  const q = await channel.assertQueue("", { exclusive: true });
  await channel.bindQueue(q.queue, EXCHANGE_NAME, routingKey);
  channel.consume(q.queue, (msg) => {
    if (msg !== null) {
      const content = JSON.parse(msg.content.toString());
      callback(content);
      channel?.ack(msg);
    }
  });

  logger.info(`Subscribed to event: ${routingKey}`);
};
