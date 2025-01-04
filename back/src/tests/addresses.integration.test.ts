import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';
import type { Address } from '@shared/types/address';
import { errors } from '../../../shared/utils/errors';
import { generateSessionToken, createSession } from '../utils/session';
import { UserModel } from '../models/users';
import { User } from '@shared/types/user';

describe('Address integration tests', () => {
  const addressWithRequiredFields: Address = {
    address: 'address-example',
    blockchain: 'Solana',
  };
  let sessionCookie: string;
  let testUser: User;

  beforeAll(async () => {
    await connectToDatabase();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();

    // Create test user
    testUser = await UserModel.create({
      _id: '67768b410e746af3be8594fa',
      username: 'test-user',
      password: 'test-password',
      addresses: [],
    });

    const sessionToken = generateSessionToken();
    sessionCookie = `session=${sessionToken}; Path=/; HttpOnly`;
    await createSession(sessionToken, testUser._id);
  });

  afterAll(async () => {
    await mongoose.connection.db?.dropDatabase();
    await mongoose.disconnect();
  });

  describe('Authentication', () => {
    it('should return 401 when no session is provided', async () => {
      const response = await request(app)
        .post('/addresses/addAddress')
        .send(addressWithRequiredFields);

      expect(response.status).toBe(401);
      expect(response.body).toStrictEqual({ error: errors.session.invalidSession });
    });
  });

  describe('Adding addresses', () => {
    it('should add an address and link it to user document', async () => {
      const response = await request(app)
        .post('/addresses/addAddress')
        .set('Cookie', [sessionCookie])
        .send(addressWithRequiredFields);

      expect(response.status).toBe(201);
      expect(response.body.address).toBe(addressWithRequiredFields.address);
      expect(response.body.blockchain).toBe(addressWithRequiredFields.blockchain);
      expect(response.body.addressContent).toStrictEqual([]);
      expect(response.body.addressName).toBe(null);

      // Verify the address is in user's addresses array
      const user = await UserModel.findOne({ _id: testUser._id });
      expect(user?.addresses).toHaveLength(1);
      expect(user?.addresses[0].toString()).toBe(response.body._id);
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
  });

  describe('Deleting addresses', () => {
    it('should delete an address and remove it from user document', async () => {
      // First add an address
      const responseAdd = await request(app)
        .post('/addresses/addAddress')
        .set('Cookie', [sessionCookie])
        .send(addressWithRequiredFields);

      expect(responseAdd.status).toBe(201);

      // Verify address was added to user
      const userBefore = await UserModel.findOne({ _id: testUser._id });
      expect(userBefore?.addresses).toHaveLength(1);

      // Delete the address
      const responseDelete = await request(app)
        .delete('/addresses/deleteAddress')
        .set('Cookie', [sessionCookie])
        .send(addressWithRequiredFields);

      expect(responseDelete.status).toBe(200);

      // Verify address was removed from user
      const userAfter = await UserModel.findOne({ _id: testUser._id });
      expect(userAfter?.addresses).toHaveLength(0);
    });

    it('should not delete an address if missing fields', async () => {
      const incompleteAddress = { address: 'incomplete-address' };
      const responseDelete = await request(app)
        .delete('/addresses/deleteAddress')
        .set('Cookie', [sessionCookie])
        .send(incompleteAddress);

      expect(responseDelete.status).toBe(400);
      expect(responseDelete.body).toStrictEqual({ error: errors.addresses.incompleteData });
    });
  });
});
