import request from 'supertest';
import app from '../app';
import mongoose from 'mongoose';
import { connectToDatabase } from '../models/connection';
import { Address, errors, isValidSolanaAddress, User } from 'crypto-dashboard-shared';
import { generateSessionToken } from '../use-cases/session/generateSessionToken';
import { createSession } from '../use-cases/session/createSession';
import { UserModel } from '../models/users';
import { AddressModel } from '../models/address';

// Mock Solana RPC calls
jest.mock('@solana/web3.js', () => ({
  createSolanaRpc: jest.fn(() => ({
    getBalance: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({ value: 1000000000n }), // 1 SOL
    }),
    getTokenAccountsByOwner: jest.fn().mockReturnValue({
      send: jest.fn().mockResolvedValue({
        value: [
          {
            account: {
              data: {
                parsed: {
                  info: {
                    mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
                    tokenAmount: {
                      amount: '100000000',
                      decimals: 6,
                      uiAmount: 100,
                    },
                  },
                },
              },
            },
          },
        ],
      }),
    }),
  })),
  address: jest.fn((addr) => addr),
  isAddress: jest.fn((addr) => {
    // Add validation logic for test addresses
    const validAddresses = [
      '6NvQ7xJZmi48jVdL8nzvEKcgXGwJPBs9aDjHPrnooRL8',
      'CpsUdHzAbmyvqf29AvT8cFEzW9AcyHdSDUi4pPGbykQg'
    ];
    return validAddresses.includes(addr);
  })
}));

// Mock Jupiter API
global.fetch = jest.fn().mockResolvedValue({
  json: jest.fn().mockResolvedValue({
    EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v: {
      symbol: 'USDC',
      name: 'USD Coin',
      address: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
      decimals: 6,
    },
  }),
});
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
    it('should return 401 when no session is provided', async () => {
      const response = await request(app)
        .post('/addresses/addAddress')
        .send(addressWithRequiredFields);

      expect(response.status).toBe(401);
      expect(response.body).toStrictEqual({ error: errors.session.invalidSession });
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

  describe.skip('Getting addresses', () => {
    it('should return user addresses', async () => {
      // First add an address
      const responseAdd = await request(app)
        .post('/addresses/addAddress')
        .set('Cookie', [sessionCookie])
        .send(addressWithRequiredFields);

      expect(responseAdd.status).toBe(201);

      const responseGet = await request(app)
        .get('/addresses/getUserAddresses')
        .set('Cookie', [sessionCookie]);

      expect(responseGet.status).toBe(200);
      expect(responseGet.body[0].addressContent).toBeDefined();
      expect(responseGet.body[0].addressContent).toHaveLength(2); // SOL + USDC
      expect(responseGet.body[0].addressContent[0]).toMatchObject({
        tokenSymbol: 'SOL',
        tokenName: 'Solana',
        amount: 1, // 1 SOL
      });
      expect(responseGet.body[0].addressContent[1]).toMatchObject({
        tokenSymbol: 'USDC',
        tokenName: 'USD Coin',
        amount: 100, // 100 USDC
      });

      const addressAfter = await AddressModel.findOne({ _id: responseGet.body[0]._id });
      expect(addressAfter?.addressContent).toBeDefined();
    });

    it('should return empty array when user has no addresses', async () => {
      const response = await request(app)
        .get('/addresses/getUserAddresses')
        .set('Cookie', [sessionCookie]);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });
});