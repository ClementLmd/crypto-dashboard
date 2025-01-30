import { User, UserSession } from 'shared';

declare module 'express-serve-static-core' {
  export interface Request {
    session?: UserSession;
    user?: User;
  }
}
