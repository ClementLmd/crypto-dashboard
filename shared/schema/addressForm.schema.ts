import { z } from 'zod';
import { Address, AddressContent } from '../types/address';
import { cryptocurrencySchema } from './cryptocurrency.schema';

export const addressContentSchema: z.Schema<AddressContent> = z.object({
  crypto: cryptocurrencySchema,
  quantity: z.number(),
});

export const addressFormSchema: z.Schema<Address> = z.object({
  address: z.string(),
  blockchain: z.enum(['Bitcoin', 'Ethereum', 'Solana']),
  addressContent: z.array(addressContentSchema).optional(),
  addressName: z.string().optional(),
});
