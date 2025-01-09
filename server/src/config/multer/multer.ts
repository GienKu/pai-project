// @deno-types="@types/multer"
import multer from 'multer';
import * as path from '@std/path';
import * as fs from '@std/fs';
import { resolvePath } from '../../utils/resolvePath.ts';

const DISK_PATH = Deno.env.get('DISK_PATH');

// Function to create a folder for each user if it doesn't exist
/**
 * Resolves the destination path for storing files based on the user ID and parent ID.
 * 
 * This function constructs a path using the provided `userId` and `parentId`, 
 * ensures that the directory exists by creating it if necessary, and returns the resolved path.
 * 
 * @param userId - The ID of the user for whom the path is being resolved.
 * @param parentId - The ID of the parent directory under which the path is being resolved.
 * @returns A promise that resolves to the full path where files should be stored.
 * @throws Will throw an error if `DISK_PATH` is not found in environment variables.
 * @throws Will rethrow any error encountered during directory creation, except for the 'AlreadyExists' error.
 */
export const resolveDestination = async (userId: string, parentId: string) => {
  if (!DISK_PATH) {
    throw new Error('DISK_PATH not found in environment variables');
  }

  const dataPath = path.resolve(
    DISK_PATH,
    userId,
    await resolvePath(userId, parentId)
  );
  try {
    await Deno.mkdir(dataPath, { recursive: true });
  } catch (e: any) {
    if (e.name !== 'AlreadyExists') {
      throw e;
    }
  }

  return dataPath;
};

const multerOptions = {
  storage: multer.memoryStorage(),
};


/**
 * Middleware for handling `multipart/form-data`, which is primarily used for uploading files.
 * This instance of multer is configured with the provided `multerOptions`.
 *
 * @constant
 * @type {multer.Instance}
 */
export const upload = multer(multerOptions);
