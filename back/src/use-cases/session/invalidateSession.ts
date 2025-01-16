import { createHash } from 'crypto';
import { UserSessionModel } from '../../models/userSession';

export async function invalidateSession(token: string): Promise<void> {
  const sessionId = createHash('sha256').update(token).digest('hex');
  await UserSessionModel.deleteOne({ id: sessionId });
}
