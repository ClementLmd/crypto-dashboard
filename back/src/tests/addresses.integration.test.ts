import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';
import type { Address } from '@shared/types/address';
import { errors } from '../../../shared/utils/errors';
import { generateSessionToken, createSession } from '../utils/session';

describe('Address integration tests', () => {
  const addressWithRequiredFields: Address = {
    address: 'address-example',
    blockchain: 'Solana',
  };
  let sessionCookie: string;

  beforeAll(async () => {
    await connectToDatabase();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();
    const sessionToken = generateSessionToken();
    sessionCookie = `session=${sessionToken}; Path=/; HttpOnly`;
    await createSession(sessionToken, 'test-user-id');
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  });

  it('should add an address in database when submitting one', async () => {
    const response = await request(app)
      .post('/addresses/addAddress')
      .set('Cookie', [sessionCookie])
      .send(addressWithRequiredFields);

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual({
      ...addressWithRequiredFields,
      addressContent: [],
      addressName: null,
    });
  });
  it('should not add an address if missing fields', async () => {
    const incompleteAddress = { address: 'incomplete-address' };
    const response = await request(app)
      .post('/addresses/addAddress')
      .set('Cookie', [sessionCookie])
      .send(incompleteAddress);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: errors.addresses.incompleteData });
  });
  it('should delete an address', async () => {
    const responseAddAddress = await request(app)
      .post('/addresses/addAddress')
      .set('Cookie', [sessionCookie])
      .send(addressWithRequiredFields);
    expect(responseAddAddress.status).toBe(201);

    const responseDeleteAddress = await request(app)
      .delete('/addresses/deleteAddress')
      .set('Cookie', [sessionCookie])
      .send(addressWithRequiredFields);

    expect(responseDeleteAddress.status).toBe(200);
  });
  it('should not delete an address if missing field', async () => {
    const incompleteAddress = { address: 'incomplete-address' };

    const responseAddAddress = await request(app)
      .post('/addresses/addAddress')
      .set('Cookie', [sessionCookie])
      .send(addressWithRequiredFields);
    expect(responseAddAddress.status).toBe(201);

    const responseDeleteAddress = await request(app)
      .delete('/addresses/deleteAddress')
      .set('Cookie', [sessionCookie])
      .send(incompleteAddress);

    expect(responseDeleteAddress.status).toBe(400);
    expect(responseDeleteAddress.body).toStrictEqual({ error: errors.addresses.incompleteData });
  });
  it('should not delete an address if the address is not in db', async () => {
    const responseDeleteAddress = await request(app)
      .delete('/addresses/deleteAddress')
      .set('Cookie', [sessionCookie])
      .send(addressWithRequiredFields);

    expect(responseDeleteAddress.status).toBe(400);
    expect(responseDeleteAddress.body).toStrictEqual({ error: errors.addresses.failedDelete });
  });
  it('should return 401 when no session is provided', async () => {
    const response = await request(app)
      .post('/addresses/addAddress')
      .send(addressWithRequiredFields);

    expect(response.status).toBe(401);
    expect(response.body).toStrictEqual({ error: errors.users.unauthorized });
  });
});
