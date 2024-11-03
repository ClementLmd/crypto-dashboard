import mongoose from 'mongoose';
import { User } from '@shared/types/user';

const userSchema = new mongoose.Schema<User>({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
});

export const UserModel = mongoose.model('User', userSchema);
