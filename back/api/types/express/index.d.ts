import { UserSession, User } from 'shared';

declare namespace Express {
  export interface Request {
    session?: UserSession;
    user?: User;
  }
}
