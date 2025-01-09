import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';
import type { Address } from '@shared/types/address';
import { errors } from '../../../shared/utils/errors';
import { generateSessionToken, createSession } from '../utils/session';
import { UserModel } from '../models/users';
import { User } from '@shared/types/user';
import { AddressModel } from '../models/address';

describe('Address integration tests', () => {
  const addressWithRequiredFields: Address = {
    address: 'CpsUdHzAbmyvqf29AvT8cFEzW9AcyHdSDUi4pPGbykQg',
    blockchain: 'Solana',
  };
  let sessionCookie: string;
  let testUserWithoutAddresses: User;

  jest.setTimeout(15000);

  beforeAll(async () => {
    await connectToDatabase();
  });

  beforeEach(async () => {
    await mongoose.connection.db?.dropDatabase();

    // Create test user
    testUserWithoutAddresses = await UserModel.create({
      _id: '67768b410e746af3be8594fa',
      username: 'test-user',
      password: 'test-password',
      addresses: [],
    });

    const sessionToken = generateSessionToken();
    sessionCookie = `session=${sessionToken}; Path=/; HttpOnly`;
    await createSession(sessionToken, testUserWithoutAddresses._id);
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
      const user = await UserModel.findOne({ _id: testUserWithoutAddresses._id });
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
    it('should add an address if valid Solana address', async () => {
      const validAddress = {
        address: '6NvQ7xJZmi48jVdL8nzvEKcgXGwJPBs9aDjHPrnooRL8',
        addressName: 'valid-address',
      };
      const response = await request(app)
        .post('/addresses/addAddress/solana')
        .set('Cookie', [sessionCookie])
        .send(validAddress);

      expect(response.status).toBe(201);
      expect(response.body.address).toBe(validAddress.address);
      expect(response.body.blockchain).toBe('Solana');
      expect(response.body.addressContent).toStrictEqual([]);
      expect(response.body.addressName).toBe(validAddress.addressName);
    });
    it('should not add an address if invalid Solana address', async () => {
      const invalidAddress = { address: 'invalid-address', addressName: 'invalid-address' };
      const response = await request(app)
        .post('/addresses/addAddress/solana')
        .set('Cookie', [sessionCookie])
        .send(invalidAddress);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: errors.addresses.invalidSolanaAddress });
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
      const userBefore = await UserModel.findOne({ _id: testUserWithoutAddresses._id });
      expect(userBefore?.addresses).toHaveLength(1);

      // Delete the address
      const responseDelete = await request(app)
        .delete('/addresses/deleteAddress')
        .set('Cookie', [sessionCookie])
        .send(addressWithRequiredFields);

      expect(responseDelete.status).toBe(200);

      // Verify address was removed from user
      const userAfter = await UserModel.findOne({ _id: testUserWithoutAddresses._id });
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

  describe('Getting addresses', () => {
    it('should return user addresses', async () => {
      // First add an address
      const responseAdd = await request(app)
        .post('/addresses/addAddress')
        .set('Cookie', [sessionCookie])
        .send(addressWithRequiredFields);

      expect(responseAdd.status).toBe(201);

      // Add delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Get addresses with retry logic
      const maxRetries = 3;
      let responseGet;

      for (let i = 0; i < maxRetries; i++) {
        responseGet = await request(app)
          .get('/addresses/getUserAddresses')
          .set('Cookie', [sessionCookie]);

        if (responseGet.status === 200) break;

        // Wait longer between retries
        await new Promise((resolve) => setTimeout(resolve, 2000 * (i + 1)));
      }

      expect(responseGet?.status).toBe(200);
      expect(responseGet?.body[0].addressContent).toBeDefined();

      const addressAfter = await AddressModel.findOne({ _id: responseGet?.body[0]._id });
      expect(addressAfter?.addressContent).toBeDefined();
    }, 20000); // Increased timeout

    it('should return empty array when user has no addresses', async () => {
      const response = await request(app)
        .get('/addresses/getUserAddresses')
        .set('Cookie', [sessionCookie]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});
