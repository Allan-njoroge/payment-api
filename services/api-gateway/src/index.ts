import express, { Application, NextFunction, Request, Response } from "express";
import logger from "./utils/logger";
import dotenv from "dotenv";
import { createProxyMiddleware } from "http-proxy-middleware";
import { validateToken } from "./middleware/auth.middleware";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser"

const app: Application = express();
dotenv.config();
app.use(cookieParser())

const proxyOptions = {
  proxyReqPathResolver: (req: Request) => {
    return req.originalUrl.replace(/^\/v1/, "/api");
  },
  proxyErrorHandler: (err: any, res: Response, next: NextFunction) => {
    logger.error(`Proxy error: ${err.message}`);
    res.status(500).json({
      message: `Internal server error`,
      error: err.message,
    });
  },
};

app.use(
  "/api/auth",
  proxy(process.env.AUTH_SERVICE_URL as string, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {}
      proxyReqOpts.headers["Content-Type"] = "application/json";
      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from auth service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
  })
);

interface CustomRequest extends Request {
  user?: { id: string };  // Adjust this to the actual shape of your user object
}
app.use(
  "/api/wallets",
  validateToken,
  proxy(process.env.WALLETS_SERVICE_URL as string, {
    ...proxyOptions,
    proxyReqOptDecorator: (proxyReqOpts, srcReq: CustomRequest) => {
      proxyReqOpts.headers = proxyReqOpts.headers || {}
      // proxyReqOpts.headers["Content-Type"] = "application/json";

      const userId = srcReq.user?.id
      if (!userId) throw new Error("User ID missing in request.");
      proxyReqOpts.headers["x-user-id"] = userId;

      return proxyReqOpts;
    },
    userResDecorator: (proxyRes, proxyResData, userReq, userRes) => {
      logger.info(
        `Response received from wallets service: ${proxyRes.statusCode}`
      );

      return proxyResData;
    },
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
