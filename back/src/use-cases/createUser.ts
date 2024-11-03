import { UserModel } from '../models/users';

export const createUser = async ({
  firstname,
  lastname,
}: {
  firstname: string;
  lastname: string;
}) => {
  const newUser = new UserModel({ firstname, lastname });
  const savedUser = await newUser.save();
  return {
    firstname: savedUser.firstname,
    lastname: savedUser.lastname,
  };
};
