import { UserSession, User } from 'crypto-dashboard-shared';

declare namespace Express {
  export interface Request {
    session?: UserSession;
    user?: User;
  }
}
