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

const FileSchema: Schema<IFile> = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true },
  parentId: { type: Schema.Types.ObjectId, default: null },
  fileType: { type: String, enum: ['file', 'folder'], required: true },
  mimeType: { type: String, required: true },
  ext: { type: String, required: true },
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
