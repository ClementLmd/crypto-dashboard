import { Request, Response } from 'express';
import { createUser } from '../use-cases/createUser';
import { getAllUsers, getUserById } from '../use-cases/getUser';
import { checkBody } from '../utils/checkBody';

export const createUserController = async (req: Request, res: Response) => {
  try {
    if (!checkBody(req.body, ['firstname', 'lastname']))
      return res.status(400).json({ error: 'Missing or empty fields' });
    const userData = {
      firstname: req.body.firstname,
      lastname: req.body.lastname,
    };
    const newUser = await createUser(userData);
    return res.status(201).json(newUser);
  } catch {
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllUsersController = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserByIdController = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const user = await getUserById(userId);
    res.status(200).json(user);
  } catch {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
