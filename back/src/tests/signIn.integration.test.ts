import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';
import { errors } from '../../../shared/utils/errors';
import type { User } from '@shared/types/user';

describe('User sign in tests', () => {
  const user = { username: 'Joe', password: 'Doedoe1' };
  beforeAll(async () => {
    await connectToDatabase();
    await mongoose.connection.db?.dropDatabase();
  });

  afterEach(async () => {
    await mongoose.connection.db?.dropDatabase();
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it('should send 200 when sign in succesfully', async () => {
    const responseSignUp = await request(app).post('/users/signup').send(user);
    expect(responseSignUp.status).toBe(201);

    const responseSignIn = await request(app).post('/users/signin').send(user);
    expect(responseSignIn.status).toBe(200);
    expect(responseSignIn.body.username).toBe(user.username);
  });

  it('should not sign in if missing fields', async () => {
    const userWithMissingField = { username: '' };
    const response = await request(app).post('/users/signin').send(userWithMissingField);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: errors.users.incompleteData });
  });

  it('should not sign in if wrong password', async () => {
    const responseSignUp = await request(app).post('/users/signup').send(user);
    expect(responseSignUp.status).toBe(201);

    const userWithIncorrectPassword = { username: 'Joe', password: 'Doe' };
    const response = await request(app).post('/users/signin').send(userWithIncorrectPassword);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: errors.users.wrongPassword });
  });
  it('should not sign in if username not found', async () => {
    const fakeUser: User = { username: 'Fake', password: 'User' };
    const response = await request(app).post('/users/signin').send(fakeUser);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: errors.users.userNotFound });
  });
});
