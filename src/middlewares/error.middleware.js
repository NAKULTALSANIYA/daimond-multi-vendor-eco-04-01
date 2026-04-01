import { env } from '../config/env.js';
import { logger } from '../config/logger.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const notFoundHandler = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const globalErrorHandler = (error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;
  logger.error(error.stack || error.message);

  const response = new ApiResponse(
    statusCode,
    error.message || 'Internal Server Error',
    env.nodeEnv === 'production' ? null : { stack: error.stack },
    error.details || null
  );

  res.status(statusCode).json(response);
};
