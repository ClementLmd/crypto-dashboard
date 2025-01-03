import type { Request, Response } from 'express';
import { verifyPassword } from '../utils/password';
import { getUserByUsername } from '../use-cases/user/getUser';
import {
  createSession,
  generateSessionToken,
  invalidateSession,
  validateSessionToken,
  getUserBySessionId,
} from '../utils/session';

export const createSessionController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await getUserByUsername(username);
    if (!existingUser) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const validPassword = await verifyPassword(password, existingUser.password);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const sessionToken = generateSessionToken();
    await createSession(sessionToken, existingUser._id);

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      path: '/',
      domain: 'localhost',
    });

    return res.status(200).json({
      user: {
        username: existingUser.username,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.error('[CreateSession] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const invalidateSessionController = async (req: Request, res: Response) => {
  const sessionId = req.cookies.session;

  if (!sessionId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    await invalidateSession(sessionId);
    res.clearCookie('session', { path: '/' });
    return res.status(200).end();
  } catch {
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const checkSessionController = async (req: Request, res: Response) => {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ error: 'No session found' });
  }

  try {
    const session = await validateSessionToken(sessionToken);

    if (!session) {
      return res.status(401).json({ error: 'Invalid session' });
    }

    const user = await getUserBySessionId(sessionToken);
    return res.status(200).json({ user });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
};
