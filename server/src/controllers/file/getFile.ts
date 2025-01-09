// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import File from '../../db/models/File.ts';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse } from 'valibot';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas.ts';

/**
 * Handles the request to get a file for a user.
 * 
 * This function retrieves a file based on the user ID and file ID provided in the request parameters.
 * It checks if the user is authenticated, validates the file ID format, and attempts to find the file in the database.
 * If the file is found, it sets the appropriate headers and initiates the file download.
 * If any error occurs during the process, it passes the error to the next middleware.
 * 
 * @param req - The request object containing user information and file ID.
 * @param res - The response object used to send the file.
 * @param next - The next middleware function in the stack.
 * 
 * @throws {Error} If the user is not defined.
 * @throws {AppError} If the file could not be found or an error occurs while sending the file.
 */
export const getFile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('user is not defined');
    }
    // check if id is in correct format
    const fileId = vParse(ObjectIdSchema, req.params.id);

    const file = await File.findOne({
      userId: req.user.id,
      _id: fileId,
    }).exec();

    if (!file) {
      throw new AppError('Could not find the file', 404);
    }

    res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
    res.download(file.path, file.name, (err) => {
      if (err) {
        throw new AppError('Error occured while sending file', 500);
      }
    });
  } catch (err) {
    next(err);
  }
};
