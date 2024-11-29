import { Schema, Document, model } from 'mongoose';
import mongoose from '../connection.ts';

interface ILink extends Document {
  fileId: Schema.Types.ObjectId;
  generatedBy: Schema.Types.ObjectId;
  accessLevel: string;
  link: string;
  expirationAt: Date;
  createdAt: Date;
}

const LinkSchema: Schema<ILink> = new Schema({
  fileId: { type: Schema.Types.ObjectId, required: true },
  generatedBy: { type: Schema.Types.ObjectId, required: true },
  accessLevel: { type: String, required: true },
  link: { type: String, required: true },
  expirationAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Link = mongoose.model<ILink>('Link', LinkSchema);

export default Link;
