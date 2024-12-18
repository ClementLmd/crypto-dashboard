import type { UserDocument } from '@shared/types/user';
import { UserModel } from '../../models/users';

export const signUp = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}): Promise<UserDocument | null> => {
  const newUser = new UserModel({ username, password });
  const savedUser: UserDocument = await newUser.save();
  return {
    username: savedUser.username,
  };
};
