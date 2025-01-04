import mongoose from 'mongoose';
import { User } from '@shared/types/user';

export interface UserDocument extends User, Document {
  addresses: mongoose.Types.ObjectId[]; // Array of Address references
}

const userSchema = new mongoose.Schema<UserDocument>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  addresses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Address',
      default: [],
    },
  ],
});

export const UserModel = mongoose.model<UserDocument>('User', userSchema);
