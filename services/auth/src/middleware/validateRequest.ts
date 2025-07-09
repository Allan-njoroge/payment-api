import { Request, Response, NextFunction } from "express";
import { ZodError, ZodTypeAny } from "zod";
import logger from "src/utils/logger"

const validateRequest =
  (schema: ZodTypeAny) =>
  (req: Request, res: Response, next: NextFunction): void => {
    try {
        schema.parse({
            body: req.body,
            query: req.query,
            params: req.params
        })
      next();
    } catch (error: any) {
      if (error instanceof ZodError) {
        for(const issue of error.issues) {
          logger.error("Validation Failed: ", issue)
          res.status(400).json({ message: issue.message });
        }
        return
      }
      logger.error("Request validation failed", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

export default validateRequest;
