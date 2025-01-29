import { createHash } from 'crypto';
import { UserSessionModel } from '../../models/userSession';
import { UserSession } from 'shared';

export async function validateSessionToken(token: string): Promise<UserSession | null> {
  try {
    const sessionId = createHash('sha256').update(token).digest('hex');

    const session = await UserSessionModel.findOne({
      id: sessionId,
      expiresAt: { $gt: new Date() },
    });

    if (!session) {
      return null;
    }

    // Extend session if it's close to expiring
    if (Date.now() >= session.expiresAt.getTime() - 1000 * 60 * 60 * 24 * 15) {
      session.expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30);
      await session.save();
    }

    return session;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return null;
  }
}
