import { Request, Response, NextFunction } from "express";
import { logger } from '../utils/logger';
import { CustomHttpError } from 'src/utils/httpErrors';

export function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  logger.error(error.stack);
  if (error instanceof CustomHttpError) {
    return res.status(error.status).json({ error: error.message });
  }
  return res.status(500).json({
    message: "Oops! Something went wrong on our end. We're working to fix it. Please try again later.",
  });
};
