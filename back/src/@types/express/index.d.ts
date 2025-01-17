import { UserSession } from 'crypto-dashboard-shared';

declare module 'express-serve-static-core' {
  interface Request {
    session?: UserSession;
  }
}
