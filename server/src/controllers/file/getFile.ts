// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import File from '../../db/models/File.ts';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse } from 'valibot';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas.ts';

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