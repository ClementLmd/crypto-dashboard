import { AddressModel } from '../../models/address';

export const addAddress = async ({}: {}) => {
  const newAddress = new AddressModel({});
  const savedAddress = await newAddress.save();
  return {
    username: savedAddress,
  };
};
