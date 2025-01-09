import * as path from '@std/path';
import File, { type FileType } from '../db/models/File.ts';
import User from '../db/models/User.ts';

/**
 * Resolves the full path of a folder given a user ID and a parent folder ID.
 *
 * @param userId - The ID of the user whose folders are being queried.
 * @param parentId - The ID of the parent folder from which to start building the path. If null, the root path is returned.
 * @returns A promise that resolves to the full path of the folder.
 *
 * @remarks
 * This function fetches all folders for the given user ID and creates a map for quick lookup.
 * It then recursively builds the path from the given parent folder ID.
 *
 * @example
 * ```typescript
 * const path = await resolvePath('user123', 'folder456');
 * console.log(path); // Outputs the full path of the folder
 * ```
 */
export async function resolvePath(
  userId: string,
  parentId: string | null
): Promise<string> {
  // Fetch all folders for the given userId
  const folders = await File.find({ userId, fileType: 'folder' }).exec();

  // Create a map for quick lookup
  const folderMap = new Map<string, FileType>();
  folders.forEach((folder) => folderMap.set(folder.id, folder));
  // Function to build the path recursively
  const buildPath = (parentId: string | null): string => {
    if (parentId === null) return '';
    
    const folder = folderMap.get(parentId);
    if (!folder) return '';
    
    return path.join(
      buildPath(folder.parentId ? folder.parentId.toString() : null),
      folder.name
    );
  };

  // Build the path starting from the given parentId
  return buildPath(parentId);
}
