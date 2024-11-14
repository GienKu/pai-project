import { AppError } from '../errors/AppError.ts';
import { Request, Response, NextFunction } from 'express';
import * as v from 'valibot';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Handle custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  // Handle Valibot validation errors
  if (err instanceof v.ValiError) {
    return res.status(400).json({
      message: 'Validation Error',
      details: err.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
        validation: issue.validation,
      })),
    });
  }

  // Console log all other errors
  console.log(err);

  // Fallback for unhandled errors
  res.status(500).json({
    message: 'Internal Server Error',
  });
};
