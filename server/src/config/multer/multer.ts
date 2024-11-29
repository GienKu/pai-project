// @deno-types="@types/multer"
import multer from 'multer';
import * as path from '@std/path';
import * as fs from '@std/fs';
import { resolvePath } from '../../utils/resolvePath.ts';

const DISK_PATH = Deno.env.get('DISK_PATH');

// Function to create a folder for each user if it doesn't exist
const resolveDestination = async (userId: string, parentId: string) => {
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

// Multer storage configuration
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    if (!req.user) {
      throw new Error('User not found in request object');
    }

    const resolvedPath = await resolveDestination(req.user.id, req.parentId);
    console.log(resolvePath);
    cb(null, resolvedPath);
  },

  filename: async (req, file, cb) => {
    if (!req.user) {
      throw new Error('User not found in request object');
    }

    const resolvedPath = await resolveDestination(req.user.id, req.parentId);
    let filename = file.originalname;
    let filePath = path.join(resolvedPath, filename);
    let fileExists = await fs.exists(filePath);
    let counter = 1;
    console.log(filePath);

    const fileExt = path.extname(filename);
    const fileNameWithoutExt = path.basename(filename, fileExt);

    while (fileExists) {
      filename = `${fileNameWithoutExt}(${counter})${fileExt}`;
      filePath = path.join(resolvedPath, filename);
      fileExists = await fs.exists(filePath);
      counter++;
    }

    cb(null, filename);
  },
});

const multerOptions = {
  storage: storage,
};

// Setup Multer to use the custom storage
export const upload = multer(multerOptions);
