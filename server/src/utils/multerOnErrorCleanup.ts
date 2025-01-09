import { Request } from 'npm:express';
import { exists } from 'jsr:@std/fs@^1.0.6/exists'; // Ensure correct import for @std/fs


/**
 * Cleans up uploaded files in case of an error during the request processing.
 * 
 * This function checks if there are any files uploaded in the request. If files are found,
 * it attempts to delete each file from the filesystem. If an error occurs during the deletion
 * of a file, it logs the error to the console.
 * 
 * @param req - The request object containing the uploaded files.
 * 
 * @returns A promise that resolves when the cleanup process is complete.
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
