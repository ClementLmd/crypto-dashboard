import mongoose from 'mongoose';
import { User, type UserDocument } from '@shared/types/user';

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
