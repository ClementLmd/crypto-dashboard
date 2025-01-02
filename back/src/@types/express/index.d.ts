import { UserSession } from '@shared/types/session';

declare module 'express-serve-static-core' {
  interface Request {
    session?: UserSession;
  }
}
