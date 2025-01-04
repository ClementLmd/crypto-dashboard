import { createAsyncThunk } from '@reduxjs/toolkit';
import { Address } from '@shared/types/address';
import { Blockchain } from '@shared/types/blockchain';

export const addAddress = createAsyncThunk('addresses/addAddress', async (newAddress: Address) => {
  const response = await fetch('http://localhost:3001/addresses/addAddress', {
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

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (addressToDelete: { address: string; blockchain: Blockchain }) => {
    const response = await fetch('http://localhost:3001/addresses/deleteAddress', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressToDelete),
    });
    console.log('response front delete', response);
    if (response.status !== 200) {
      const deleteAddressFailed = await response.json();
      throw new Error(`Error ${response.status}: ${deleteAddressFailed.error}`);
    }
    return addressToDelete;
  },
);
