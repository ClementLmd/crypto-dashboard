// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Request, Response } from 'express';
import { UserSession, User } from 'crypto-dashboard-shared';

declare global {
  namespace Express {
    interface Request {
      session?: UserSession;
      user?: User;
    }
  }
}
