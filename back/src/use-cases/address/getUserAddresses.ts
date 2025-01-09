import { Address } from '@shared/types/address';
import { UserModel } from '../../models/users';
import { AddressModel } from '../../models/address';
import { User } from '@shared/types/user';
import { getSolanaTokens } from './getSolanaTokens';

export const getUserAddresses = async (user: User): Promise<Address[]> => {
  const userAddresses = await UserModel.findById(user._id).populate('addresses');
  if (!userAddresses) return [];

  const addresses = await Promise.all(
    userAddresses.addresses.map(async (addr) => {
      if (addr.blockchain === 'Solana') {
        const tokens = await getSolanaTokens(addr.address);

        // Update the address document with new token data
        const updatedAddress = await AddressModel.findByIdAndUpdate(
          addr._id,
          { $set: { addressContent: tokens } },
          { new: true },
        );

        return updatedAddress || addr;
      }
      return addr;
    }),
  );

  return addresses;
};
