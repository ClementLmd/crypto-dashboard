import { errors } from './errors';

export const validateUserPassword = (password: string) => {
  const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/;
  if (!password || !passwordRegex.test(password)) {
    return errors.users.incorrectPasswordFormat;
  }
};
