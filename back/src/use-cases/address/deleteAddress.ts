import type { Address } from '@shared/types/address';
import { AddressModel } from '../../models/address';

export const deleteAddress = async ({ address, blockchain }: Address): Promise<boolean> => {
  const deletedAddress = await AddressModel.deleteOne({ address, blockchain });
  if (deletedAddress.deletedCount > 0) return true;
  return false;
};
