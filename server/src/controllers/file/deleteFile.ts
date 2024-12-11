// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import File from '../../db/models/File.ts';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse } from 'valibot';
import { ObjectIdSchema } from '../../validation-schemas/validationSchemas.ts';
import User from '../../db/models/User.ts';
import { deleteFolderRec } from '../../utils/deleteFolderRec.ts';

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

    //check if file exists
    const file = await File.findOne({
      userId: req.user.id,
      _id: fileId,
    }).exec();

    if (!file) {
      throw new AppError('File not found', 404);
    }

    // check if it is file or folder
    if (file.fileType === 'folder') {
      // delete from db recurisvely
      const storageFreed = await deleteFolderRec(file.id);

      // update used storage
      await User.findByIdAndUpdate(req.user.id, {
        usedStorage: req.user.usedStorage - storageFreed,
      });

      // delete from disk recursively
      await Deno.remove(file.path, { recursive: true });

      return void res.status(200).send('Deleted folder of id:' + file.id);
    } else if (file.fileType === 'file') {
      // delete from db
      const deletedFile = await File.findOneAndDelete({
        userId: req.user.id,
        _id: fileId,
      }).exec();

      if (!deletedFile) {
        throw new AppError('Could not delete file', 400);
      }

      // delete from disk
      await Deno.remove(file.path);

      // update used storage
      await User.findByIdAndUpdate(req.user.id, {
        usedStorage: req.user.usedStorage - file.size,
      });

      return void res.status(200).send('Deleted file of id:' + file.id);
    }
  } catch (err) {
    next(err);
  }
};
