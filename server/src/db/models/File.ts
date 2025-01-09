import { Schema, Document, type InferSchemaType } from 'mongoose';
import mongoose from '../connection.ts';

interface IFile extends Document {
  userId: Schema.Types.ObjectId;
  parentId: Schema.Types.ObjectId | null;
  fileType: 'file' | 'folder';
  mimeType: string;
  ext: string;
  size: number;
  path: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Schema definition for the File model.
 * 
 * @typedef {Object} IFile
 * @property {Schema.Types.ObjectId} userId - The ID of the user who owns the file. This field is required.
 * @property {Schema.Types.ObjectId} [parentId=null] - The ID of the parent folder. Defaults to null.
 * @property {('file'|'folder')} fileType - The type of the file, either 'file' or 'folder'. This field is required.
 * @property {string} [mimeType] - The MIME type of the file. This field is optional.
 * @property {string} [ext] - The file extension. This field is optional.
 * @property {number} size - The size of the file in bytes. This field is required.
 * @property {string} path - The path to the file. This field is required.
 * @property {string} name - The name of the file. This field is required.
 * @property {Date} [createdAt=Date.now] - The date and time when the file was created. Defaults to the current date and time.
 * @property {Date} [updatedAt=Date.now] - The date and time when the file was last updated. Defaults to the current date and time.
 */
export const FileSchema: Schema<IFile> = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  parentId: { type: Schema.Types.ObjectId, default: null },
  fileType: { type: String, enum: ['file', 'folder'], required: true },
  mimeType: { type: String, required: false },
  ext: { type: String, required: false },
  size: { type: Number, required: true },
  path: { type: String, required: true },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const File = mongoose.model<IFile>('File', FileSchema);

type FileType = InferSchemaType<typeof FileSchema>;
export type { FileType };
export default File;
