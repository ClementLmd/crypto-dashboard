import { RootState } from '../../redux/store';

export const selectAddresses = (state: RootState) => state.addresses.addresses;
export const selectAddressesIsLoading = (state: RootState) => state.addresses.isLoading;
