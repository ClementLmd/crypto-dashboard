import app from '../app';
import request from 'supertest';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';

describe('User e2e', () => {
  const user = { username: 'John', password: 'Doedoe1' };
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
  it('user should sign up and sign in', async () => {
    const signUpResponse = await request(app).post('/users/signup').send(user);

    expect(signUpResponse.status).toBe(201);
    expect(signUpResponse.body.username).toBe(user.username);

    const signInResponse = await request(app).post('/users/signin').send(user);
    expect(signInResponse.status).toBe(200);
    expect(signInResponse.body.username).toBe(user.username);
  });
});
