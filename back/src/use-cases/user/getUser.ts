import { UserModel, type UserDocument } from '../../models/users';

export const getAllUsers = async (): Promise<UserDocument[] | null> => await UserModel.find();

export const getUserById = async (id: string): Promise<UserDocument | null> =>
  await UserModel.findById(id);

export const getUserByUsername = async (username: string): Promise<UserDocument | null> =>
  await UserModel.findOne({ username });
