import express, { Application } from "express";
import dotenv from "dotenv";
import logger from "./utils/logger";

// import routes here
import walletRoutes from "./routes/wallets.routes"

const app: Application = express();
app.use(express.json())
dotenv.config();

app.get("/", (req, res) => {
  res.json({message: "Good Morning"})
})

app.use("/api/wallets", walletRoutes)


const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  logger.info(`server is running in http://localhost:${PORT}`);
});
