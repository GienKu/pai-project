import { Request } from 'npm:express';
import { exists } from 'jsr:@std/fs@^1.0.6/exists'; // Ensure correct import for @std/fs

/*
 * This function cleans up uploaded files in case of an error.
 */
export const multerOnErrorCleanup = async (req: Request) => {
  if (req.files) {
    const files = req.files as Express.Multer.File[];

    for (const file of files) {
      try {
        // Check if file exists before attempting to delete
        if (await exists(file.path)) {
          await Deno.remove(file.path); // Delete the file
        }
      } catch (err) {
        console.error(`Error deleting file ${file.path}:`, err);
      }
    }
  }
};
