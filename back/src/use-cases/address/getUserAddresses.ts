import { Address } from '@shared/types/address';
import { UserModel } from '../../models/users';
import { User } from '@shared/types/user';

export const getUserAddresses = async (user: User): Promise<Address[]> => {
  const userAddresses = await UserModel.findById(user._id).populate('addresses');
  if (!userAddresses) return [];

  return (userAddresses.addresses as unknown as Address[]).map((addr) => ({
    address: addr.address,
    blockchain: addr.blockchain,
    //TODO: add these fields
    // addressContent: addr.addressContent || [],
    // addressName: addr.addressName || null,
  }));
};
