import { verifyPassword } from '../utils/password';
import { getUserByUsername } from './getUser';

export const signIn = async ({ username, password }: { username: string; password: string }) => {
  const user = await getUserByUsername(username);
  if (!user) return false;
  if (!verifyPassword(password, user?.password)) return false;
  return user;
};
