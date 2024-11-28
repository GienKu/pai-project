// @deno-types="@types/multer"
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const DISK_PATH = Deno.env.get('DISK_PATH');

// Function to create a folder for each user if it doesn't exist
const createUserRootFolder = (userId: string) => {
  if (!DISK_PATH) {
    throw new Error('DISK_PATH not found in environment variables');
  }

  const dataPath = path.resolve(DISK_PATH, userId);

  if (!fs.existsSync(dataPath)) {
    fs.mkdirSync(dataPath, { recursive: true });
  }

  return dataPath;
};

// const fileFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   const ext = path.extname(file.originalname);
//   if (!ACCEPTED_FILES_EXT.includes(ext)) {
//     return cb(new AppError('Niedozwolony format pliku', 400));
//   }
//   cb(null, true);
// };

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (!req.user) {
      throw new Error('User not found in request object');
    }
    const user = req.user;
    const p = path.join('uploads', user.id);

    // Set the destination to the companyFolder folder
    cb(null, userRootFolder);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerOptions = {
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fieldSize: 1024 * 1024 * 25, // 25MB
  },
};

// Setup Multer to use the custom storage
export const upload = multer(multerOptions);
