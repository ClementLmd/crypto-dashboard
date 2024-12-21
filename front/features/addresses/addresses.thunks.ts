import { createAsyncThunk } from '@reduxjs/toolkit';
import { Blockchain } from '@shared/types/blockchain';

export const addAddress = createAsyncThunk(
  'addresses/addAddress',
  async (newAddress: { address: string; blockchain: Blockchain }) => {
    const response = await fetch('http://localhost:3001/addresses/addAddress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newAddress),
    });
    if (response.status !== 201) {
      const addAddressFailed = await response.json();
      throw new Error(`Error ${response.status}: ${addAddressFailed.error}`);
    }
    const addedAddress = await response.json();
    return addedAddress;
  },
);

export const deleteAddress = createAsyncThunk(
  'addresses/deleteAddress',
  async (addressToDelete: { address: string; blockchain: Blockchain }) => {
    const response = await fetch('http://localhost:3001/addresses/deleteAddress', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(addressToDelete),
    });
    if (response.status !== 200) {
      const deleteAddressFailed = await response.json();
      throw new Error(`Error ${response.status}: ${deleteAddressFailed.error}`);
    }
    return addressToDelete;
  },
);
