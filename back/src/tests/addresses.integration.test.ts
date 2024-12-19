import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';
import type { Address } from '@shared/types/address';

describe('Address integration tests', () => {
  const address: Address = {
    address: 'address-example',
    blockchain: 'Solana',
  };
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

  it('should add an address in database when submitting one', async () => {
    const response = await request(app).post('/addresses/addAddress').send(address);

    expect(response.status).toBe(201);
    console.log(response.body);
    // expect(response.body.username).toBe(user.username);
  });
});
