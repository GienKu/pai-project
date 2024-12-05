// @deno-types="@types/express"
import { Request, Response, NextFunction } from 'express';
import { parse as vParse } from 'valibot';
import { CreateFolderSchema } from '../../validation-schemas/validationSchemas.ts';
import File from '../../db/models/File.ts';
import * as path from '@std/path';
import { resolvePath } from '../../utils/resolvePath.ts';

const DISK_PATH = Deno.env.get('DISK_PATH');

// Function to create a folder for each user if it doesn't exist
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
