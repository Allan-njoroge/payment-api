import express, { Application } from "express";
import logger from "./utils/logger";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";

const app: Application = express();
dotenv.config();

app.use(
  "/api/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
  })
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  logger.info(`API-Gateway is running in http://localhost:${PORT}`);
  logger.info(`AUTH service is running ${process.env.AUTH_SERVICE_URL}`);
  logger.info(
    `NOTIFICATIONS service is running ${process.env.NOTIFICATIONS_SERVICE_URL}`
  );
});
