import request from 'supertest';
import mongoose from 'mongoose';
import app from '../app';
import { connectToDatabase } from '../models/connection';
import { UserModel } from '../models/users';
import { UserSessionModel } from '../models/userSession';
import { generateSessionToken } from '../use-cases/session/generateSessionToken';
import { errors } from 'crypto-dashboard-shared';
import { createHash } from 'crypto';

describe('Auth integration tests', () => {
  const testUser = {
    username: 'testuser',
    password: 'Password123',
  };

  beforeAll(async () => {
    await connectToDatabase();
    await mongoose.connection.db?.dropDatabase();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  });

  describe('POST /auth/login', () => {
    it('should create a session when login is successful', async () => {
      // First create a user
      await request(app).post('/users/signup').send(testUser);

      // Try to login
      const response = await request(app).post('/auth/login').send(testUser);

      expect(response.status).toBe(200);
      expect(response.body.user.username).toBe(testUser.username);

      // Check if session cookie is set
      expect(response.headers['set-cookie']).toBeDefined();
      const cookie = response.headers['set-cookie'][0];
      expect(cookie).toMatch(/session=/);
    });

    it('should return 401 with invalid credentials', async () => {
      const response = await request(app)
        .post('/auth/login')
        .send({ ...testUser, password: 'wrongpassword' });

      expect(response.status).toBe(400);
      expect(response.body.error).toStrictEqual(errors.session.invalidCredentials);
      expect(response.headers['set-cookie']).toBeUndefined();
    });
  });

  describe('GET /auth/check', () => {
    it('should return user data with valid session', async () => {
      // Create a user
      const user = new UserModel(testUser);
      await user.save();

      // Create a session
      const token = generateSessionToken();
      const sessionId = createHash('sha256').update(token).digest('hex');
      const session = new UserSessionModel({
        id: sessionId,
        userId: user._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      });
      await session.save();

      const response = await request(app)
        .get('/auth/check')
        .set('Cookie', [`session=${token}`]);

      expect(response.status).toBe(200);
      expect(response.body.authenticated).toBe(true);
    });

    it('should return 401 with invalid session', async () => {
      const response = await request(app)
        .get('/auth/check')
        .set('Cookie', ['session=invalidsession']);

      expect(response.status).toBe(401);
      expect(response.body.authenticated).toBe(false);
    });

    it('should return 401 with no session', async () => {
      const response = await request(app).get('/auth/check');

      expect(response.status).toBe(401);
      expect(response.body.authenticated).toBe(false);
    });
  });

  describe('POST /auth/logout', () => {
    it('should clear session cookie and invalidate session', async () => {
      // Create a user and session first
      const user = new UserModel(testUser);
      await user.save();

      const token = generateSessionToken();
      const sessionId = createHash('sha256').update(token).digest('hex');

      const session = new UserSessionModel({
        id: sessionId,
        userId: user._id,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      await session.save();

      const response = await request(app)
        .post('/auth/logout')
        .set('Cookie', [`session=${token}`]);

      expect(response.status).toBe(200);

      // Check if cookie is cleared
      expect(response.headers['set-cookie'][0]).toMatch(/session=;/);

      // Verify session is removed from database
      const sessionExists = await UserSessionModel.findOne({ token });
      expect(sessionExists).toBeNull();
    });
  });

  describe('Session expiration', () => {
    it('should reject expired sessions', async () => {
      // Create a user
      const user = new UserModel(testUser);
      await user.save();

      // Create an expired session
      const token = generateSessionToken();
      const sessionId = createHash('sha256').update(token).digest('hex');

      const session = new UserSessionModel({
        id: sessionId,
        userId: user._id,
        expiresAt: new Date(Date.now() - 1000), // Expired
      });
      await session.save();

      const response = await request(app)
        .get('/auth/check')
        .set('Cookie', [`session=${token}`]);

      expect(response.status).toBe(401);
      expect(response.body.error).toBe(errors.session.invalidSession);
    });
  });
});
