import mongoose from 'mongoose';
import { User } from '@shared/types/user';

const userSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export const UserModel = mongoose.model('User', userSchema);
