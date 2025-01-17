import { SigningUpUser } from 'crypto-dashboard-shared';
import { UserModel } from '../../models/users';

export const signUp = async ({ username, password }: SigningUpUser) => {
  const newUser = new UserModel({ username, password });
  const savedUser = await newUser.save();
  return savedUser;
};
