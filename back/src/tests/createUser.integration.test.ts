import { UserModel } from '../models/users';
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';

describe('UserModel test', () => {
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

  it('should create and save a new user', async () => {
    const user = { username: 'Joe', password: 'Doe' };
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();

    expect(savedUser.username).toBe(user.username);
    expect(savedUser.password).toBe(user.password);
  });

  it('should send 201 when creating new user', async () => {
    const user = { username: 'John', password: 'Doe' };
    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body.username).toBe(user.username);
    expect(response.body.password).toBe(user.password);
  });
  it('should not create a user with missing fields', async () => {
    const user = { username: '' };
    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(400);
  });
});
