import { UserModel } from '../models/users';
import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';
import { errors } from 'shared';

describe('User sign up tests', () => {
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

  it('should create and save a new user', async () => {
    const newUser = new UserModel(user);
    const savedUser = await newUser.save();

    expect(savedUser.username).toBe(user.username);
  });

  it('should send 201 when creating new user', async () => {
    const response = await request(app).post('/users/signup').send(user);

    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe(user.username);
  });

  it('should not create a user with missing fields', async () => {
    const userWithMissingField = { username: '' };
    const response = await request(app).post('/users/signup').send(userWithMissingField);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: errors.users.incompleteData });
  });
  it('should not create user if incorrect password format', async () => {
    const userWithIncorrectPasswordFormat = { username: 'John', password: 'Doe' };
    const response = await request(app).post('/users/signup').send(userWithIncorrectPasswordFormat);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: errors.users.incorrectPasswordFormat });
  });
  it('should not create user if username already exists in database', async () => {
    const response = await request(app).post('/users/signup').send(user);
    expect(response.status).toBe(201);
    expect(response.body.user.username).toBe(user.username);

    const responseWithSameUsername = await request(app).post('/users/signup').send(user);
    expect(responseWithSameUsername.status).toBe(400);
    expect(responseWithSameUsername.body.error).toBe(errors.users.duplicatedUsername);
  });
});
