import { Request, Response } from 'express';
import { signUp } from '../use-cases/user/signUp';
import { getAllUsers, getUserById, getUserByUsername } from '../use-cases/user/getUser';
import { checkBody } from '../utils/checkBody';
import { hashPassword } from '../utils/password';
import { errors, SigningUpUser, validateUserPassword } from 'crypto-dashboard-shared';
import { createSession } from '../use-cases/session/createSession';
import { generateSessionToken } from '../use-cases/session/generateSessionToken';

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
    const userData: SigningUpUser = {
      username: username,
      password: hashedPassword,
    };
    const newUser = await signUp(userData);

    const sessionToken = generateSessionToken();
    await createSession(sessionToken, newUser._id);

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : 'localhost',
    });

    return res.status(201).json({
      user: {
        username: newUser.username,
      },
      authenticated: true,
    });
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

// TODO: add update user
// TODO: add delete user
