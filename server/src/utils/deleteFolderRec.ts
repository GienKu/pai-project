import File from '../db/models/File.ts';

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
