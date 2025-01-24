import { UserSession, User } from 'crypto-dashboard-shared';

declare global {
  namespace Express {
    interface Request {
      session?: UserSession;
      user?: User;
    }
  }
}
