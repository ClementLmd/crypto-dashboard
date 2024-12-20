import { createSlice } from '@reduxjs/toolkit';
import { Address } from '@shared/types/address';
import { addAddress } from './addresses.thunks';

interface AddressState {
  addresses: Address[];
  isLoading: boolean;
}

const initialState: AddressState = {
  addresses: [],
  isLoading: false,
};

export const addressSlice = createSlice({
  name: 'addresses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses.push(action.payload);
      });
  },
});

export const addressReducer = addressSlice.reducer;
