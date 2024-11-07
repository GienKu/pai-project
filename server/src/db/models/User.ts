import { Schema, Document } from 'mongoose';
import mongoose from '../connection.ts';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: number;
  storageLimit: number;
  usedStorage: number;
  maxUploadSize: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 0 },
  storageLimit: { type: Number, required: true, default: 0 },
  usedStorage: { type: Number, required: true, default: 0 },
  maxUploadSize: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
