import { UserModel } from '../models/users';

export const signUp = async ({ username, password }: { username: string; password: string }) => {
  const newUser = new UserModel({ username, password });
  const savedUser = await newUser.save();
  return {
    username: savedUser.username,
  };
};
