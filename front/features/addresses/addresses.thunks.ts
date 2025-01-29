import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address, Blockchain } from 'shared';
import { api } from '../../app/config/api';

export const addAddress = createAsyncThunk('addresses/addAddress', async (newAddress: Address) => {
  const response = await fetch(api.addresses.add, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newAddress),
    credentials: 'include',
  });
  if (response.status !== 201) {
    const addressAddFailed = await response.json();
    throw new Error(`Error ${response.status}: ${addressAddFailed.error}`);
  }
  const addedAddress = await response.json();
  return addedAddress;
});

export const addSolanaAddress = createAsyncThunk(
  'addresses/addSolanaAddress',
  async (newAddress: Address) => {
    const response = await fetch(api.addresses.addSolanaAddress, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
      credentials: 'include',
    });
    if (response.status !== 201) {
      const addressAddFailed = await response.json();
      throw new Error(`Error ${response.status}: ${addressAddFailed.error}`);
    }
    const addedAddress = await response.json();
    return addedAddress;
  },
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (addressToDelete: { address: string; blockchain: Blockchain }) => {
    const response = await fetch(api.addresses.delete, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressToDelete),
      credentials: 'include',
    });
    if (response.status !== 200) {
      const deleteAddressFailed = await response.json();
      throw new Error(`Error ${response.status}: ${deleteAddressFailed.error}`);
    }
    return addressToDelete;
  },
);

export const getUserAddresses = createAsyncThunk('addresses/getUserAddresses', async () => {
  const response = await fetch(api.addresses.get, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  });
  if (response.status !== 200) {
    const getAddressesFailed = await response.json();
    throw new Error(`Error ${response.status}: ${getAddressesFailed.error}`);
  }
  const addresses = await response.json();
  return addresses;
});
