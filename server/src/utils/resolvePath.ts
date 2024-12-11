import * as path from '@std/path';
import File, { type FileType } from '../db/models/File.ts';
import User from '../db/models/User.ts';

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
