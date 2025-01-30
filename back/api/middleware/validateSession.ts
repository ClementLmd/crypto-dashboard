import { Request, Response, NextFunction } from 'express';
import { validateSessionToken } from '../use-cases/session/validateSessionToken';
import { getUserBySessionId } from '../use-cases/session/getUserBySessionId';
import { errors } from 'shared';
import { UserSession, User } from 'shared';

interface RequestWithAuth extends Request {
  session?: UserSession;
  user?: User;
}

export const validateSession = (req: RequestWithAuth, res: Response, next: NextFunction): void => {
  const sessionToken = req.cookies.session;

  if (!sessionToken) {
    res.status(401).json({ error: errors.session.invalidSession });
    return;
  }

  validateSessionToken(sessionToken)
    .then((session) => {
      if (!session) {
        res.status(401).json({ error: errors.users.unauthorized });
        return;
      }

      return getUserBySessionId(sessionToken).then((user) => {
        req.session = session;
        req.user = user;
        next();
      });
    })
    .catch((error) => {
      console.error('[ValidateSession] Error:', error);
      res.status(500).json({ error: errors.internal });
    });
};
