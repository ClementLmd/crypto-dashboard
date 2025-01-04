import { Address } from '@shared/types/address';
import { UserModel } from '../../models/users';

export const getUserAddresses = async (userId: string): Promise<Address[]> => {
  const user = await UserModel.findById(userId).populate('addresses');
  if (!user) return [];

  return (user.addresses as unknown as Address[]).map((addr) => ({
    address: addr.address,
    blockchain: addr.blockchain,
    //TODO: add these fields
    // addressContent: addr.addressContent || [],
    // addressName: addr.addressName || null,
  }));
};
