import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from './encode';
import { sha256 } from '@oslojs/crypto/sha2';
import { UserSession } from '@shared/types/session';
import { UserSessionModel } from '../models/userSession';

export function generateSessionToken(): string {
  const bytes = new Uint8Array(20);
  crypto.getRandomValues(bytes);
  const token = encodeBase32LowerCaseNoPadding(bytes);
  return token;
}

export async function createSession(token: string, userId: string): Promise<UserSession> {
  const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  // Find and delete any existing sessions for this user
  await UserSessionModel.deleteMany({ userId });

  // Create new session
  const session = new UserSessionModel({ id: sessionId, userId, expiresAt });
  await session.save();

  return session;
}

export async function validateSessionToken(token: string): Promise<UserSession | null> {
  try {
    const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)));
    const session = await UserSessionModel.findOne({ id: sessionId }).exec();

    if (!session || Date.now() >= session.expiresAt.getTime()) {
      if (session) {
        await UserSessionModel.deleteOne({ id: sessionId });
      }

      return null;
    }

    // Extend session if it's close to expiring
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await session.save();
    }

    return session;
  } catch (error) {
    console.error('[ValidateSessionToken] Error:', error);
    return null;
  }
}

export async function invalidateSession(sessionId: string): Promise<void> {
  await UserSessionModel.deleteOne({ id: sessionId });
}
