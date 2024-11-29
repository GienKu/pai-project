// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import File from '../../db/models/File.ts';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse} from 'valibot'
import { GetFilesSchema } from "../../validation-schemas/validationSchemas.ts";

export const getFilesInfo = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('user is not defined');
    }
    // check if id is in correct format
    const pid = vParse(GetFilesSchema,  req.params.parentId)
    
    // find all files that have parentId set to parentId specified in req,
    // if it is root then parentId is null
    const parentId =
      pid === 'root' ? null : req.params.parentId;

    const files = await File.find({
      userId: req.user.id,
      parentId,
    }).exec();

    const mappedFiles = files
      .map((file) => ({
        id: file.id,
        name: file.name, // name is with extension
        path: file.path, //full path
        size: (file.size / 1024 / 1024).toFixed(2), // in mb
        date: new Date(file.updatedAt).toLocaleDateString('en-GB'),
        type: file.fileType, // file | folder
        ext: file.ext, // .pdf, .jpg ...etc
      }))
      .sort((a, b) => {
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        return 0;
      });

    res.status(200).send(mappedFiles);
  } catch (err) {
    next(err);
  }
};
