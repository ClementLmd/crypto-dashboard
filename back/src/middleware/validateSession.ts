import { Request, Response, NextFunction } from 'express';
import { validateSessionToken } from '../use-cases/session/validateSessionToken';
import { getUserBySessionId } from '../use-cases/session/getUserBySessionId';
import { errors } from '../../../shared/utils/errors';
import { UserSession } from '@shared/types/session';
import { User } from '@shared/types/user';

interface RequestWithAuth extends Request {
  session?: UserSession;
  user?: User;
}

export const validateSession = async (req: RequestWithAuth, res: Response, next: NextFunction) => {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    return res.status(401).json({ error: errors.session.invalidSession });
  }

  try {
    const session = await validateSessionToken(sessionToken);

    if (!session) {
      return res.status(401).json({ error: errors.users.unauthorized });
    }

    const user = await getUserBySessionId(sessionToken);

    req.session = session;
    req.user = user;

    next();
  } catch (error) {
    console.error('[ValidateSession] Error:', error);
    return res.status(500).json({ error: errors.internal });
  }
};
