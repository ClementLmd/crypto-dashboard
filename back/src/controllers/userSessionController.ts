import type { Request, Response } from 'express';
import { verifyPassword } from '../utils/password';
import { getUserById, getUserByUsername } from '../use-cases/user/getUser';
import { errors } from 'crypto-dashboard-shared';
import { createSession } from '../use-cases/session/createSession';
import { generateSessionToken } from '../use-cases/session/generateSessionToken';
import { invalidateSession } from '../use-cases/session/invalidateSession';
import { validateSessionToken } from '../use-cases/session/validateSessionToken';

export const createSessionController = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const existingUser = await getUserByUsername(username);
    if (!existingUser) {
      return res.status(400).json({ error: errors.session.invalidCredentials });
    }

    const validPassword = await verifyPassword(password, existingUser.password);
    if (!validPassword) {
      return res.status(400).json({ error: errors.session.invalidCredentials });
    }

    const sessionToken = generateSessionToken();
    await createSession(sessionToken, existingUser._id);

    res.cookie('session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 60 * 60 * 24 * 30 * 1000, // 30 days
      path: '/',
      domain: process.env.NODE_ENV === 'production' ? process.env.COOKIE_DOMAIN : 'localhost',
    });

    return res.status(200).json({
      user: {
        username: existingUser.username,
      },
      authenticated: true,
    });
  } catch (error) {
    console.error('[CreateSession] Error:', error);
    return res.status(500).json({ error: errors.internal });
  }
};

export const invalidateSessionController = async (req: Request, res: Response) => {
  const sessionId = req.cookies.session;

  if (!sessionId) {
    return res.status(401).json({ error: errors.session.invalidSession });
  }

  try {
    await invalidateSession(sessionId);
    res.clearCookie('session', { path: '/' });
    return res.status(200).end();
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};

export const checkSessionController = async (req: Request, res: Response) => {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ authenticated: false, error: errors.session.noSession });
  }

  try {
    const session = await validateSessionToken(sessionToken);

    if (!session) {
      return res.status(401).json({
        authenticated: false,
        error: errors.session.invalidSession,
      });
    }
    const user = await getUserById(session.userId);

    return res.status(200).json({
      authenticated: true,
      user: {
        username: user?.username || null,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return res.status(500).json({ error: errors.internal });
  }
};
