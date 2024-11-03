import { UserModel } from '../models/users';

export const getAllUsers = async () => await UserModel.find();

export const getUserById = async (id: string) => await UserModel.findById(id);
