import File from '../db/models/File.ts';

/**
 * Recursively deletes a folder and all its contents from the database.
 *
 * @param id - The ID of the folder to delete.
 * @returns A promise that resolves to the total amount of storage freed by deleting the folder and its contents.
 *
 * @remarks
 * This function first retrieves all files and folders within the specified folder.
 * If a file is a folder, it recursively deletes its contents before deleting the folder itself.
 * For regular files, it deletes the file and accumulates the total storage freed.
 * Finally, it deletes the folder specified by the given ID.
 */
export const deleteFolderRec = async (id: string) => {
  // get all files and folders in the folder
  const files = await File.find({ parentId: id }).exec();
  let storageFreed = 0;

  for (const file of files) {
    if (file.fileType === 'folder') {
      storageFreed += await deleteFolderRec(file.id);

      await File.findOneAndDelete({ _id: file.id }).exec();
    } else {
      const f = await File.findOneAndDelete({ _id: file.id }).exec();
      storageFreed += f?.size ?? 0;
    }
  }
  await File.findOneAndDelete({ _id: id }).exec();
  return storageFreed;
};
