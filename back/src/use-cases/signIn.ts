import { verifyPassword } from '../utils/password';
import { getUserByUsername } from './getUser';
import { errors } from '../../../shared/utils/errors';

export const signIn = async ({ username, password }: { username: string; password: string }) => {
  const user = await getUserByUsername(username);
  if (!user) return errors.users.userNotFound;

  const isPasswordMatching = await verifyPassword(password, user?.password);
  if (!isPasswordMatching) {
    return errors.users.wrongPassword;
  }
  return user;
};
