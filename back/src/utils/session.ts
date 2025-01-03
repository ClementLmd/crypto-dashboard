import { encodeBase32LowerCaseNoPadding } from './encode';
import { createHash } from 'crypto';
import { UserSession } from '@shared/types/session';
import { UserSessionModel } from '../models/userSession';
import { UserModel } from '../models/users';

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  console.log('token generated :', token);
  return token;
}

export async function createSession(token: string, userId: string): Promise<UserSession> {
  const sessionId = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await UserSessionModel.deleteMany({ userId });
  const session = new UserSessionModel({ id: sessionId, userId, expiresAt });
  await session.save();
  console.log('session created :', session);

  return session;
}

export async function validateSessionToken(token: string): Promise<UserSession | null> {
  try {
    console.log('token to validate :', token);
    const sessionId = createHash('sha256').update(token).digest('hex');
    console.log('sessionId in validateSessionToken :', sessionId);
    const session = await UserSessionModel.findOne({
      id: sessionId,
      expiresAt: { $gt: new Date() },
    });
    console.log('session found :', session);
    if (!session) {
      return null;
    }

    // Extend session if it's close to expiring
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await session.save();
      console.log('session extended :', session);
    }

    return session;
  } catch (error) {
    console.error('[ValidateSessionToken] Error:', error);
    return null;
  }
}

export async function invalidateSession(token: string): Promise<void> {
  const sessionId = createHash('sha256').update(token).digest('hex');
  await UserSessionModel.deleteOne({ id: sessionId });
}

export async function getUserBySessionId(token: string) {
  const sessionId = createHash('sha256').update(token).digest('hex');
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  console.log('sessionId from getUserBySessionId', sessionId);
  const session = await UserSessionModel.findOne({
    id: sessionId,
    expiresAt: { $gt: new Date() },
  });
  console.log('session from getUserBySessionId', session);
  if (!session) {
    throw new Error('Invalid or expired session');
  }

  const user = await UserModel.findById(session.userId);
  if (!user) {
    throw new Error('User not found');
  }

  return {
    id: user._id,
    username: user.username,
  };
}
