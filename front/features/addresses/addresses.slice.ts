import { createSlice } from '@reduxjs/toolkit';
import { Address } from '@shared/types/address';
import { addAddress, addSolanaAddress, deleteAddress, getUserAddresses } from './addresses.thunks';

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
      })
      .addCase(addSolanaAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addSolanaAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses.push(action.payload);
      })
      .addCase(deleteAddress.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = state.addresses.filter(
          (address) =>
            address.address !== action.payload.address ||
            address.blockchain !== action.payload.blockchain,
        );
      })
      .addCase(getUserAddresses.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getUserAddresses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.addresses = action.payload;
      });
  },
});

export const addressReducer = addressSlice.reducer;
