import { z } from 'zod';
import { Cryptocurrency } from '../types/cryptocurrency';

export const cryptocurrencySchema: z.Schema<Cryptocurrency> = z.object({
  cryptoName: z.string(),
  price: z.number(),
});
