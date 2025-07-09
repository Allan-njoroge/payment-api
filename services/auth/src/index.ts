import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

import logger from "src/utils/logger";
import { connectToRabbitMQ } from "src/utils";

import authRoutes from "src/routes/auth.routes";
import tokenRoutes from "src/routes/tokens.routes"
import accountRoutes from "src/routes/accounts.routes"


const app = express();
dotenv.config();

app.use(express.json());
app.use(cookieParser());

// routes definition
app.use("/api/auth", authRoutes);
app.use("/api/token", tokenRoutes)
app.use("/api/accounts", accountRoutes)

connectToRabbitMQ();

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  logger.info(`server is running in http://localhost:${PORT}`);
});
