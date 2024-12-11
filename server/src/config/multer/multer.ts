// @deno-types="@types/multer"
import multer from 'multer';
import * as path from '@std/path';
import * as fs from '@std/fs';
import { resolvePath } from '../../utils/resolvePath.ts';

const DISK_PATH = Deno.env.get('DISK_PATH');

// Function to create a folder for each user if it doesn't exist
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

// Setup Multer to use the custom storage
export const upload = multer(multerOptions);
