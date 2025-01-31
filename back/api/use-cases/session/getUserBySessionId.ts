import { createHash } from 'crypto';
import { UserModel } from '../../models/users';
import { UserSessionModel } from '../../models/userSession';

export async function getUserBySessionId(token: string) {
  const sessionId = createHash('sha256').update(token).digest('hex');
  if (!sessionId) {
    throw new Error('Session ID is required');
  }

  const session = await UserSessionModel.findOne({
    id: sessionId,
    expiresAt: { $gt: new Date() },
  });

  if (!session) {
    throw new Error('Invalid or expired session');
  }

  const user = await UserModel.findById(session.userId);
  if (!user) {
    throw new Error('User not found');
  }

  return user;
}
