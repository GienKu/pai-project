import { Schema, Document, type InferSchemaType } from 'mongoose';
import mongoose from '../connection.ts';

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: number;
  storageLimit: number;
  usedStorage: number;
  maxUploadSize: number;
  verifiedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  isBlocked: boolean;
}

/**
 * UserSchema defines the structure of the User document in the database.
 * 
 * Properties:
 * - `username` (String): The username of the user. This field is required.
 * - `email` (String): The email address of the user. This field is required and must be unique.
 * - `password` (String): The password of the user. This field is required.
 * - `role` (Number): The role of the user. This field is required and defaults to 0.
 * - `storageLimit` (Number): The storage limit for the user in bytes. This field is required and defaults to 100MB.
 * - `usedStorage` (Number): The amount of storage used by the user in bytes. This field is required and defaults to 0.
 * - `maxUploadSize` (Number): The maximum upload size for the user in MB. This field is required and defaults to 100MB.
 * - `verifiedAt` (Date): The date when the user was verified. This field is optional and defaults to null.
 * - `createdAt` (Date): The date when the user was created. This field defaults to the current date and time.
 * - `updatedAt` (Date): The date when the user was last updated. This field defaults to the current date and time.
 * - `isBlocked` (Boolean): Indicates whether the user is blocked. This field is required and defaults to false.
 */
export const UserSchema: Schema<IUser> = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: Number, required: true, default: 0 },
  storageLimit: { type: Number, required: true, default: 100 * 1024 * 1024 },//100mb
  usedStorage: { type: Number, required: true, default: 0 },
  maxUploadSize: { type: Number, required: true, default: 100 },// in mb
  verifiedAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  isBlocked: { type: Boolean, required: true, default: false },
});

const User = mongoose.model<IUser>('User', UserSchema);

type UserType = InferSchemaType<typeof UserSchema>;
export type { UserType };
export default User;
