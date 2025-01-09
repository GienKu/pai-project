import { Schema, Document, model } from 'mongoose';
import mongoose from '../connection.ts';

interface ILink extends Document {
  fileId: Schema.Types.ObjectId;
  generatedById: Schema.Types.ObjectId;
  accessLevel: string;
  expirationAt: Date;
  createdAt: Date;
}

/**
 * Schema definition for the Link model.
 * 
 * @typedef {Object} ILink
 * @property {ObjectId} fileId - The ID of the file associated with the link. This field is required.
 * @property {ObjectId} generatedById - The ID of the user who generated the link. This field is required.
 * @property {string} accessLevel - The access level of the link. This field is required.
 * @property {Date} expirationAt - The expiration date and time of the link. This field is required.
 * @property {Date} createdAt - The creation date and time of the link. Defaults to the current date and time.
 */
export const LinkSchema: Schema<ILink> = new Schema({
  fileId: { type: Schema.Types.ObjectId, required: true },
  generatedById: { type: Schema.Types.ObjectId, required: true },
  accessLevel: { type: String, required: true },
  expirationAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Link = mongoose.model<ILink>('Link', LinkSchema);

export default Link;
