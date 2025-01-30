import { Request, Response } from 'express';
import { getTokenPrice } from '../use-cases/tokens/getTokenPrice';
import { errors } from 'shared';

export const getTokenPriceController = async (req: Request, res: Response): Promise<void> => {
  const { address } = req.params;

  if (!address) {
    res.status(400).json({ error: 'Token address is required' });
    return;
  }

  try {
    const price = await getTokenPrice(address);
    if (!price) {
      res.status(404).json({ error: 'Token price not found' });
      return;
    }

    res.status(200).json(price);
  } catch {
    res.status(500).json({ error: errors.internal });
    return;
  }
};
