import { Request, Response } from 'express';
import { getTokenPrice } from '../use-cases/tokens/getTokenPrice';
import { errors } from 'shared';

export const getTokenPriceController = async (req: Request, res: Response) => {
  const { address } = req.params;

  if (!address) {
    return res.status(400).json({ error: 'Token address is required' });
  }

  try {
    const price = await getTokenPrice(address);
    if (!price) {
      return res.status(404).json({ error: 'Token price not found' });
    }

    return res.status(200).json(price);
  } catch {
    return res.status(500).json({ error: errors.internal });
  }
};
