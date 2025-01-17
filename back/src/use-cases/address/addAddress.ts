import { Address } from 'crypto-dashboard-shared';
import { AddressModel } from '../../models/address';

export const addAddress = async ({
  address,
  addressContent,
  blockchain,
  addressName,
}: Address): Promise<Address> => {
  const newAddress = new AddressModel({ address, addressContent, blockchain, addressName });
  const savedAddress = await newAddress.save();
  return {
    _id: savedAddress._id,
    address: savedAddress.address,
    blockchain: savedAddress.blockchain,
    addressContent: savedAddress.addressContent,
    addressName: savedAddress.addressName,
  };
};
