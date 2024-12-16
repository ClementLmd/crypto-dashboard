import { Request, Response } from 'express';
import { signUp } from '../use-cases/signUp';
import { getAllUsers, getUserById, getUserByUsername } from '../use-cases/getUser';
import { checkBody } from '../utils/checkBody';
import { validateUserPassword } from '../../../shared/utils/validateUserPassword';
import { errors } from '../../../shared/utils/errors';
import { hashPassword } from '../utils/password';
import { signIn } from '../use-cases/signIn';

export const signUpController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    if (!checkBody(req.body, ['username', 'password']))
      return res.status(400).json({ error: errors.users.incompleteData });

    const isPasswordValid = validateUserPassword(password);
    if (isPasswordValid) {
      return res.status(400).json({ error: isPasswordValid });
    }

    const isUsernameValid = await getUserByUsername(username);
    if (isUsernameValid !== null)
      return res.status(400).json({ error: errors.users.duplicatedUsername });

    const hashedPassword = await hashPassword(password);

    const userData = {
      username: username,
      password: hashedPassword,
    };
    const newUser = await signUp(userData);
    return res.status(201).json(newUser);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};

export const signInController = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    if (!checkBody(req.body, ['username', 'password']))
      return res.status(400).json({ error: errors.users.incompleteData });

    const signInResponse = await signIn({ username, password });
    if (typeof signInResponse === 'string') return res.status(400).json({ error: signInResponse });
    const userSignedIn = { username: signInResponse.username };
    return res.status(200).json(userSignedIn);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};
