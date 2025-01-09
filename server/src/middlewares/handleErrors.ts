import { AppError } from '../errors/AppError.ts';
import { Request, Response, NextFunction } from 'express';
import * as v from 'valibot';

/**
 * Middleware to handle errors in the application.
 *
 * @param err - The error object that was thrown.
 * @param req - The Express request object.
 * @param res - The Express response object.
 * @param next - The next middleware function in the stack.
 *
 * This middleware handles different types of errors:
 * - Custom `AppError` instances, returning the appropriate status code and message.
 * - `ValiError` instances from Valibot, returning a 400 status code with validation error details.
 * - Logs all other errors to the console and returns a 500 status code with a generic message.
 */
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
