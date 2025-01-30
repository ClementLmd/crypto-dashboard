import { Request, Response } from 'express';
import { Address, errors, isValidSolanaAddress, User } from 'shared';
import { checkBody } from '../utils/checkBody';
import { addAddress } from '../use-cases/address/addAddress';
import { deleteAddress } from '../use-cases/address/deleteAddress';
import { UserModel } from '../models/users';
import { getUserAddresses } from '../use-cases/address/getUserAddresses';

export const addAddressController = async (
  req: Request & { user?: User },
  res: Response,
): Promise<void> => {
  const { address, blockchain, addressContent, addressName }: Address = req.body;

  try {
    if (!checkBody(req.body, ['address', 'blockchain'])) {
      res.status(400).json({ error: errors.addresses.incompleteData });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: errors.users.unauthorized });
      return;
    }

    const addressData: Address = { address, blockchain, addressContent, addressName };

    const newAddress = await addAddress(addressData);

    // Update user's addresses array
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $push: { addresses: newAddress._id } },
      { new: true },
    );

    res.status(201).json(newAddress);
  } catch {
    res.status(500).json({ error: errors.internal });
  }
};

export const deleteAddressController = async (
  req: Request & { user?: User },
  res: Response,
): Promise<void> => {
  const { address, blockchain }: Address = req.body;

  try {
    if (!checkBody(req.body, ['address', 'blockchain'])) {
      res.status(400).json({ error: errors.addresses.incompleteData });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: errors.users.unauthorized });
      return;
    }

    const addressToDelete: Address = { address, blockchain };

    const deletedAddress = await deleteAddress(addressToDelete);
    if (!deletedAddress?._id) {
      res.status(400).json({ error: errors.addresses.failedDelete });
      return;
    }

    // Remove address from user's addresses array
    await UserModel.findByIdAndUpdate(
      req.user._id,
      { $pull: { addresses: deletedAddress._id } },
      { new: true },
    );

    res.status(200).json();
  } catch {
    res.status(500).json({ error: errors.internal });
  }
};

export const getUserAddressesController = async (
  req: Request & { user?: User },
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: errors.users.unauthorized });
      return;
    }

    const addresses = await getUserAddresses(req.user);
    res.status(200).json(addresses);
  } catch {
    res.status(500).json({ error: errors.internal });
  }
};

export const addSolanaAddressController = async (
  req: Request & { user?: User },
  res: Response,
): Promise<void> => {
  const { address, addressName }: Address = req.body;

  try {
    if (!isValidSolanaAddress(address)) {
      res.status(400).json({ error: errors.addresses.invalidSolanaAddress });
      return;
    }

    if (!req.user) {
      res.status(401).json({ error: errors.users.unauthorized });
      return;
    }

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

    res.status(201).json(newAddress);
  } catch {
    res.status(500).json({ error: errors.internal });
  }
};
