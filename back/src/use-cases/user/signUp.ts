import type { User } from '@shared/types/user';
import { UserModel } from '../../models/users';

export const signUp = async ({ username, password }: User) => {
  const newUser = new UserModel({ username, password });
  const savedUser = await newUser.save();
  return {
    username: savedUser.username,
  };
};
