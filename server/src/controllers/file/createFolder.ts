// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { CreateFolderSchema } from '../../validation-schemas/validationSchemas.ts';
import File from '../../db/models/File.ts';
import * as path from '@std/path';
import { resolvePath } from '../../utils/resolvePath.ts';

const DISK_PATH = Deno.env.get('DISK_PATH');

/**
 * Creates a folder at the specified path and returns the path.
 *
 * @param userId - The ID of the user creating the folder.
 * @param parentId - The ID of the parent folder. If null, the folder will be created at the root level.
 * @param folderName - The name of the folder to be created.
 * @returns The path of the created folder.
 * @throws Will throw an error if `DISK_PATH` is not found in environment variables.
 * @throws Will throw an error if the folder creation fails for reasons other than the folder already existing.
 */
const createFolderAndReturnPath = async (
  userId: string,
  parentId: string | null,
  folderName: string
) => {
  if (!DISK_PATH) {
    throw new Error('DISK_PATH not found in environment variables');
  }

  const dataPath = path.resolve(
    DISK_PATH,
    userId,
    await resolvePath(userId, parentId),
    folderName
  );
  try {
    await Deno.mkdir(dataPath, { recursive: true });
  } catch (e: any) {
    if (e.name !== 'AlreadyExists') {
      throw e;
    }
    return dataPath;
  }

  return dataPath;
};

/**
 * Creates a new folder for the authenticated user.
 *
 * @param req - The request object containing user information and folder details.
 * @param res - The response object used to send the folder path back to the client.
 * @param next - The next middleware function in the stack.
 *
 * @throws Will throw an error if the user is not defined.
 *
 * @example
 * // Example request body
 * {
 *   "name": "New Folder",
 *   "parentId": "root"
 * }
 *
 * @remarks
 * This function validates the request body against the `CreateFolderSchema`,
 * creates the folder, and saves its details in the database.
 */
export const createFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      throw new Error('user not defined');
    }
    const { name, parentId } = vParse(CreateFolderSchema, req.body);
    const pid = parentId === 'root' ? null : parentId;

    const folderPath = await createFolderAndReturnPath(req.user.id, pid, name);

    (
      await File.create({
        path: folderPath,
        size: 0,
        mimeType: '',
        ext: '',
        name: name,
        userId: req.user.id,
        parentId: pid,
        fileType: 'folder',
      })
    ).save();

    res.status(200).send(folderPath);
  } catch (err) {
    next(err);
  }
};
