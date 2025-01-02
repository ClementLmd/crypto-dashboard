import { Request, Response, NextFunction } from 'express';
import { validateSessionToken } from '../utils/session';
import { errors } from '../../../shared/utils/errors';
import { UserSession } from '@shared/types/session';

interface RequestWithSession extends Request {
  session?: UserSession;
}

export const validateSession = async (
  req: RequestWithSession,
  res: Response,
  next: NextFunction,
) => {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ error: errors.users.unauthorized });
  }

  try {
    const session = await validateSessionToken(sessionToken);

    if (!session) {
      return res.status(401).json({ error: errors.users.unauthorized });
    }

    req.session = session;
    next();
  } catch (error) {
    console.error('[ValidateSession] Error:', error);
    return res.status(500).json({ error: errors.internal });
  }
};
