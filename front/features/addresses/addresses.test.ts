import { configureStore } from '@reduxjs/toolkit';
import { Address } from '@shared/types/address';
import { addressReducer } from './addresses.slice';
import { addAddress, deleteAddress } from './addresses.thunks';
import { selectAddresses } from './addresses.selectors';
import { userReducer } from '../user/user.slice';

describe('User slice', () => {
  const mockAddress: Address = {
    address: 'address-example',
    blockchain: 'Solana',
    addressContent: [],
    addressName: 'address 1',
  };

  const createTestStore = () =>
    configureStore({
      reducer: {
        users: userReducer,
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
});
