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
    const user = { firstname: 'Joe', lastname: 'Doe' };
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();

    expect(savedUser.firstname).toBe(user.firstname);
    expect(savedUser.lastname).toBe(user.lastname);
  });

  it('should send 201 when creating new user', async () => {
    const user = { firstname: 'John', lastname: 'Doe' };
    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(201);
    expect(response.body.firstname).toBe(user.firstname);
    expect(response.body.lastname).toBe(user.lastname);
  });
  it('should not create a user with missing fields', async () => {
    const user = { firstname: '' };
    const response = await request(app).post('/users').send(user);

    expect(response.status).toBe(400);
  });
});
