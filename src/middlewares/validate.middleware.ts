import type { NextFunction, Request, Response } from 'express';
import type { ZodSchema } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { AppError } from '../utils/AppError';

export const validate =
  (schema: ZodSchema) => (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse({ body: req.body, params: req.params, query: req.query });

    if (!result.success) {
      const message = result.error.errors.map((issue) => issue.message).join(', ');
      return next(new AppError(message, StatusCodes.BAD_REQUEST));
    }

    req.body = result.data.body ?? req.body;
    req.params = result.data.params ?? req.params;
    req.query = result.data.query ?? req.query;
    return next();
  };
