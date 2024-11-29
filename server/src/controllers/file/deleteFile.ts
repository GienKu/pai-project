// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import File from '../../db/models/File.ts';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse } from 'valibot';
import {  ObjectIdSchema } from '../../validation-schemas/validationSchemas.ts';

export const deleteFile = async (
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

    //delete from db
    const file = await File.findOneAndDelete({
      userId: req.user.id,
      _id: fileId,
    }).exec();

    
    if (!file) {
        throw new AppError('Could not delete file', 400);
    }
    
    //delete from disk
    await Deno.remove(file.path);

    res.status(200).send('Deleted file of id:' + file.id);
  } catch (err) {
    next(err);
  }
};
