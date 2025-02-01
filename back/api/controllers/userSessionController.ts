import { Request, Response } from 'express';
import { verifyPassword } from '../utils/password';
import { getUserById, getUserByUsername } from '../use-cases/user/getUser';
import { errors } from 'shared';
import { createSession } from '../use-cases/session/createSession';
import { generateSessionToken } from '../use-cases/session/generateSessionToken';
import { invalidateSession } from '../use-cases/session/invalidateSession';
import { validateSessionToken } from '../use-cases/session/validateSessionToken';

export const createSessionController = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const existingUser = await getUserByUsername(username);
    if (!existingUser) {
      res.status(400).json({ error: errors.session.invalidCredentials });
      return;
    }

    const validPassword = await verifyPassword(password, existingUser.password);
    if (!validPassword) {
      res.status(400).json({ error: errors.session.invalidCredentials });
      return;
    }

    const sessionToken = generateSessionToken();
    await createSession(sessionToken, existingUser._id);

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      path: '/',
    });

    res.status(200).json({
      user: {
        username: existingUser.username,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error('[CreateSession] Error:', error);
    res.status(500).json({ error: errors.internal });
  }
};

export const invalidateSessionController = async (req: Request, res: Response): Promise<void> => {
  const sessionId = req.cookies.session;

  if (!sessionId) {
    res.status(401).json({ error: errors.session.invalidSession });
    return;
  }

  try {
    await invalidateSession(sessionId);
    res.clearCookie('session', { path: '/' });
    res.status(200).end();
  } catch {
    res.status(500).json({ error: errors.internal });
  }
};

export const checkSessionController = async (req: Request, res: Response): Promise<void> => {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    res.status(401).json({ authenticated: false, error: errors.session.noSession });
    return;
  }

  try {
    const session = await validateSessionToken(sessionToken);

    if (!session) {
      res.status(401).json({
        authenticated: false,
        error: errors.session.invalidSession,
      });
      return;
    }
    const user = await getUserById(session.userId);

    res.status(200).json({
      authenticated: true,
      user: {
        username: user?.username || null,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    res.status(500).json({ error: errors.internal });
  }
};
