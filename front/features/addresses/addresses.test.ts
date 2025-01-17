import { configureStore } from '@reduxjs/toolkit';
import { Address } from 'crypto-dashboard-shared';
import { addressReducer } from './addresses.slice';
import { addAddress, addSolanaAddress, deleteAddress, getUserAddresses } from './addresses.thunks';
import { selectAddresses } from './addresses.selectors';
import { userReducer } from '../user/user.slice';

describe('Addresses slice', () => {
  const mockAddress: Address = {
    address: 'address-example',
    blockchain: 'Solana',
    addressContent: [],
    addressName: 'address 1',
  };

  const createTestStore = () =>
    configureStore({
      reducer: {
        user: userReducer,
        addresses: addressReducer,
      },
    });
  it('should add an address in database and store it in redux store', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => mockAddress,
      status: 201,
    } as Response);

    const store = createTestStore();
    const addressesBeforeAdd = selectAddresses(store.getState());
    expect(addressesBeforeAdd).toEqual([]);

    await store.dispatch(addAddress(mockAddress));

    const addressesAfterAdd = selectAddresses(store.getState());
    expect(addressesAfterAdd).toEqual([mockAddress]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });
  it('should not store an address in redux store if adding it to db failed', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 400,
    } as Response);

    const store = createTestStore();
    const addressesBeforeAdd = selectAddresses(store.getState());
    expect(addressesBeforeAdd).toEqual([]);

    await store.dispatch(addAddress(mockAddress));

    const addressesAfterAdd = selectAddresses(store.getState());
    expect(addressesAfterAdd).toEqual([]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });

  it('should delete an address from db and redux store', async () => {
    const mockFetchAddAddress = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => mockAddress,
      status: 201,
    } as Response);

    const store = createTestStore();

    await store.dispatch(addAddress(mockAddress));
    const addressesAfterAdd = selectAddresses(store.getState());
    expect(addressesAfterAdd).toEqual([mockAddress]);

    mockFetchAddAddress.mockRestore();

    const mockFetchDeleteAddress = jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
    } as Response);

    await store.dispatch(deleteAddress(mockAddress));
    const addressesAfterDelete = selectAddresses(store.getState());
    expect(addressesAfterDelete).toEqual([]);

    mockFetchDeleteAddress.mockRestore();
  });
  it('should get user addresses and store them in redux store', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => [mockAddress],
      status: 200,
    } as Response);

    const store = createTestStore();
    const addressesBeforeGet = selectAddresses(store.getState());
    expect(addressesBeforeGet).toEqual([]);

    await store.dispatch(getUserAddresses());

    const addressesAfterGet = selectAddresses(store.getState());
    expect(addressesAfterGet).toEqual([mockAddress]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });

  it('should not store addresses in redux store if getting them failed', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 401,
    } as Response);

    const store = createTestStore();
    const addressesBeforeGet = selectAddresses(store.getState());
    expect(addressesBeforeGet).toEqual([]);

    await store.dispatch(getUserAddresses());

    const addressesAfterGet = selectAddresses(store.getState());
    expect(addressesAfterGet).toEqual([]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });
  it('should add a Solana address to the database and store it in the redux store', async () => {
    const mockFetch = jest.spyOn(global, 'fetch').mockResolvedValue({
      json: async () => mockAddress,
      status: 201,
    } as Response);

    const store = createTestStore();
    const addressesBeforeAdd = selectAddresses(store.getState());
    expect(addressesBeforeAdd).toEqual([]);

    await store.dispatch(addSolanaAddress(mockAddress));

    const addressesAfterAdd = selectAddresses(store.getState());
    expect(addressesAfterAdd).toEqual([mockAddress]);

    expect(mockFetch).toHaveBeenCalledTimes(1);
    mockFetch.mockRestore();
  });
});
