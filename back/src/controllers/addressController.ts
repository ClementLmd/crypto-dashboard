import { Request, Response } from 'express';
import type { Address } from '../../../shared/types/address';
import { checkBody } from '../utils/checkBody';
import { errors } from '../../../shared/utils/errors';
import { addAddress } from '../use-cases/address/addAddress';

export const addAddressController = async (req: Request, res: Response) => {
  const { address, blockchain, addressContent, addressName }: Address = req.body;

  try {
    if (!checkBody(req.body, ['address', 'blockchain']))
      return res.status(400).json({ error: errors.addresses.incompleteData });

    const addressData: Address = { address, blockchain, addressContent, addressName };

    const newAddress = await addAddress(addressData);
    return res.status(201).json(newAddress);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};
