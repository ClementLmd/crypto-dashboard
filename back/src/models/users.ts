import mongoose from 'mongoose';
import { User } from '@shared/types/user';

export interface UserDocument extends User, Document {}

const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
