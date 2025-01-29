import { UserSession, User } from 'shared';

declare global {
  namespace Express {
    interface Request {
      session?: UserSession;
      user?: User;
    }
  }
}
