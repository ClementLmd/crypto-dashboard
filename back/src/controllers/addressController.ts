import { Request, Response } from 'express';
import type { Address } from '../../../shared/types/address';
import { checkBody } from '../utils/checkBody';
import { errors } from '../../../shared/utils/errors';
import { addAddress } from '../use-cases/address/addAddress';
import { deleteAddress } from '../use-cases/address/deleteAddress';
import { User } from '../../../shared/types/user';
import { UserModel } from '../models/users';
import { getUserAddresses } from '../use-cases/address/getUserAddresses';
import { isValidSolanaAddress } from '../utils/isValidAddress';

export const addAddressController = async (req: Request & { user?: User }, res: Response) => {
  const { address, blockchain, addressContent, addressName }: Address = req.body;

  try {
    if (!checkBody(req.body, ['address', 'blockchain']))
      return res.status(400).json({ error: errors.addresses.incompleteData });

    if (!req.user) return res.status(401).json({ error: errors.users.unauthorized });

    const addressData: Address = { address, blockchain, addressContent, addressName };

    const newAddress = await addAddress(addressData);

    // Update user's addresses array
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: newAddress._id } },
      { new: true },
    );

    return res.status(201).json(newAddress);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};

export const deleteAddressController = async (req: Request & { user?: User }, res: Response) => {
  const { address, blockchain }: Address = req.body;

  try {
    if (!checkBody(req.body, ['address', 'blockchain']))
      return res.status(400).json({ error: errors.addresses.incompleteData });

    if (!req.user) return res.status(401).json({ error: errors.users.unauthorized });

    const addressToDelete: Address = { address, blockchain };

    const deletedAddress = await deleteAddress(addressToDelete);
    if (!deletedAddress?._id) {
      return res.status(400).json({ error: errors.addresses.failedDelete });
    }

    // Remove address from user's addresses array
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: deletedAddress._id } },
      { new: true },
    );

    return res.status(200).json();
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};

export const getUserAddressesController = async (req: Request & { user?: User }, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: errors.users.unauthorized });

    const addresses = await getUserAddresses(req.user);
    return res.status(200).json(addresses);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};

export const addSolanaAddressController = async (req: Request & { user?: User }, res: Response) => {
  const { address, addressName }: Address = req.body;

  try {
    if (!isValidSolanaAddress(address)) {
      return res.status(400).json({ error: errors.addresses.invalidSolanaAddress });
    }

    if (!req.user) return res.status(401).json({ error: errors.users.unauthorized });

    const addressData: Address = {
      address,
      blockchain: 'Solana',
      addressContent: [],
      addressName: addressName,
    };

    const newAddress = await addAddress(addressData);

    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: newAddress._id } },
      { new: true },
    );

    return res.status(201).json(newAddress);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};
