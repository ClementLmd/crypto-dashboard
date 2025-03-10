import { Address } from 'shared';
import { AddressModel } from '../../models/address';

export const deleteAddress = async ({ address, blockchain }: Address): Promise<Address | null> => {
  const deletedAddress = await AddressModel.findOneAndDelete({ address, blockchain });
  return deletedAddress;
};
