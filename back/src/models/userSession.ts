import mongoose from 'mongoose';
import { UserSession } from 'crypto-dashboard-shared';

export interface UserSessionDocument extends UserSession, Document {}

const userSessionSchema = new mongoose.Schema<UserSessionDocument>({
  id: { type: String, required: true, unique: true },
  userId: { type: String, required: true },
  expiresAt: { type: Date, required: true },
});

export const UserSessionModel = mongoose.model<UserSessionDocument>(
  'UserSession',
  userSessionSchema,
);
