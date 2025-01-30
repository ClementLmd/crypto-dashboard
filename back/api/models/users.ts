import mongoose from 'mongoose';
import { User } from 'shared';
import { Address } from 'shared';
export interface UserDocument extends User, Document {
  addresses: Address[];
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
