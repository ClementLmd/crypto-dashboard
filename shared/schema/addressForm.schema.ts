import { z } from 'zod';
import { Address, AddressContent } from '../types/address';

export const addressContentSchema: z.Schema<AddressContent> = z.object({
  tokenSymbol: z.string(),
  tokenName: z.string(),
  amount: z.number(),
  usdValue: z.number(),
  totalUsdValue: z.number(),
  mintAddress: z.string().nullable().optional(),
  lastUpdated: z.date(),
});

export const addressFormSchema: z.Schema<Address> = z.object({
  address: z.string(),
  blockchain: z.enum(['Bitcoin', 'Ethereum', 'Solana']),
  addressContent: z.array(addressContentSchema).optional(),
  addressName: z.string().nullable().default(null),
});
