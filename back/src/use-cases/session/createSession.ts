import { createHash } from 'crypto';
import { UserSessionModel } from '../../models/userSession';
import { UserSession } from 'crypto-dashboard-shared';

export async function createSession(token: string, userId: string): Promise<UserSession> {
  const sessionId = createHash('sha256').update(token).digest('hex');
  const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);

  await UserSessionModel.deleteMany({ userId });
  const session = new UserSessionModel({ id: sessionId, userId, expiresAt });
  await session.save();

  return session;
}
