// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import File from '../../db/models/File.ts';
import { AppError } from '../../errors/AppError.ts';
import { parse as vParse} from 'valibot'
import { GetFilesSchema } from "../../validation-schemas/validationSchemas.ts";

/**
 * Retrieves the file structure information for a given user and parent folder.
 *
 * @param req - The request object containing user information and parameters.
 * @param res - The response object used to send the file structure information.
 * @param next - The next middleware function in the stack.
 *
 * @throws Will throw an error if the user is not defined in the request.
 *
 * The function performs the following steps:
 * 1. Checks if the user is defined in the request.
 * 2. Validates the parentId parameter using the GetFilesSchema.
 * 3. Determines the parentId to use for querying files.
 * 4. Finds all files associated with the user and the specified parentId.
 * 5. Maps the file information to a structured format.
 * 6. Sorts the files, prioritizing folders over other file types.
 * 7. Sends the mapped and sorted file information as a response.
 */
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
