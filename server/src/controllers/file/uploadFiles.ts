// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { multerOnErrorCleanup } from '../../utils/multerOnErrorCleanup.ts';
import File from '../../db/models/File.ts';
import { resolveDestination, upload } from '../../config/multer/multer.ts';
import * as path from '@std/path';
import * as fs from '@std/fs';
import { AppError } from '../../errors/AppError.ts';
import User from '../../db/models/User.ts';

const uploadArray = upload.array('files');

/**
 * Handles the upload of multiple files. This function uses a middleware to upload files to the disk,
 * resolves the destination folder, and saves the file information to the database.
 * It also checks for user storage limits and handles errors appropriately.
 *
 * @param req - The request object containing user information, files, and parentId.
 * @param res - The response object used to send the status of the upload.
 * @param next - The next middleware function in the stack.
 *
 * @throws {Error} If there is an error during file upload or if user information is not found in the request.
 * @throws {AppError} If the parentId is not provided or if the user exceeds their storage limit.
 */
export const uploadFiles = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // uploadArray is a middleware that uploads files to the disk
  uploadArray(req, res, async (err: any) => {
    try {
      if (err) {
        // Cleanup files in case of an error
        // await multerOnErrorCleanup(req);
        return next(err);
      }

      if (!req.user) {
        return next(new Error('User not found in request object'));
      }

      if (!req.body.parentId) {
        throw next(new AppError('Bad request - parentId not provided', 404));
      }

      //id of the folder where file should be saved, null means root folder
      const parentId = req.body.parentId === 'root' ? null : req.body.parentId;

      //files in memry
      const files = req.files as Express.Multer.File[];

      //save files
      const destination = await resolveDestination(req.user.id, parentId);

      for (const file of files) {
        let filename = file.originalname;
        let filePath = path.join(destination, filename);
        let fileExists = await fs.exists(filePath);

        const fileExt = path.extname(filename);
        const fileNameWithoutExt = path.basename(filename, fileExt);

        let counter = 1;
        while (fileExists) {
          filename = `${fileNameWithoutExt}(${counter})${fileExt}`;
          filePath = path.join(destination, filename);
          fileExists = await fs.exists(filePath);
          counter++;
        }

        //save to disk
        const finalFilePath = path.join(destination, filename);
        await Deno.writeFile(finalFilePath, file.buffer);

        //save to db
        (
          await File.create({
            name: filename,
            path: finalFilePath,
            size: file.size,
            mimeType: file.mimetype,
            ext: path.extname(file.originalname),
            userId: req.user.id,
            fileType: 'file',
            parentId: parentId,
          })
        ).save();
      }

      // // save files info to the database
      // for (const file of files) {
      //   (
      //     await File.create({
      //       name: file.filename,
      //       path: file.path,
      //       size: file.size,
      //       mimeType: file.mimetype,
      //       ext: path.extname(file.originalname),
      //       userId: req.user.id,
      //       fileType: 'file',
      //       parentId: parentId,
      //     })
      //   ).save();
      // }

      //sum file sizes
      const filesInBytes = files.reduce((acc, file) => acc + file.size, 0);

      if (filesInBytes + req.user.usedStorage > req.user.storageLimit) {
        throw new AppError('User space limit exceeded... aborting upload', 400);
      }

      await User.findByIdAndUpdate(req.user.id, {
        usedStorage: req.user.usedStorage + filesInBytes,
      }).exec();

      res.status(200).send('Files uploaded successfully');
    } catch (error: any) {
      // await multerOnErrorCleanup(req);
      next(error);
    }
  });
};
