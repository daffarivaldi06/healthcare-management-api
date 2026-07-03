import type { ErrorRequestHandler, RequestHandler } from 'express';
import { StatusCodes } from 'http-status-codes';
import { Prisma } from '@prisma/client';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.method} ${req.originalUrl}`, StatusCodes.NOT_FOUND));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  void next;
  let statusCode = error instanceof AppError ? error.statusCode : StatusCodes.INTERNAL_SERVER_ERROR;
  let message = error.message || 'Internal server error';

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') {
      statusCode = StatusCodes.CONFLICT;
      message = 'A record with this unique value already exists';
    }

    if (error.code === 'P2025') {
      statusCode = StatusCodes.NOT_FOUND;
      message = 'Requested record was not found';
    }
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV !== 'production' && { stack: error.stack })
  });
};
