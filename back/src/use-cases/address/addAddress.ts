import type { Address } from '@shared/types/address';
import { AddressModel } from '../../models/address';

export const addAddress = async ({ address, addressContent, blockchain, addressName }: Address) => {
  const newAddress = new AddressModel({ address, addressContent, blockchain, addressName });
  const savedAddress = await newAddress.save();
  return {
    username: savedAddress,
  };
};
