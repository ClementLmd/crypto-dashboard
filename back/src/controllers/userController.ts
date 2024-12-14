import { Request, Response } from 'express';
import { createUser } from '../use-cases/createUser';
import { getAllUsers, getUserById, getUserByUsername } from '../use-cases/getUser';
import { checkBody } from '../utils/checkBody';
import { validateUserPassword } from '../../../shared/utils/validateUserPassword';
import { errors } from '../../../shared/utils/errors';

export const createUserController = async (req: Request, res: Response) => {
  try {
    if (!checkBody(req.body, ['username', 'password']))
      return res.status(400).json({ error: errors.users.incompleteData });

    const isPasswordValid = validateUserPassword(req.body.password);
    if (isPasswordValid) {
      return res.status(400).json({ error: isPasswordValid });
    }

    const isUsernameValid = await getUserByUsername(req.body.username);
    if (isUsernameValid !== null)
      return res.status(400).json({ error: errors.users.duplicatedUsername });

    const userData = {
      username: req.body.username,
      password: req.body.password,
    };
    const newUser = await createUser(userData);
    return res.status(201).json(newUser);
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
