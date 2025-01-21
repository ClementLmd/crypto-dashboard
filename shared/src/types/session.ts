import { User } from './user';

export interface UserSession {
  id: string;
  userId: string;
  expiresAt: Date;
}

export type SessionValidationResult =
  | { session: UserSession; user: User }
  | { session: null; user: null };
