import type { Blockchain } from './blockchain';

export interface Address {
  _id?: string;
  addressName?: string | null;
  address: string;
  blockchain: Blockchain;
  addressContent?: AddressContent[];
}

export interface AddressContent {
  tokenSymbol: string;
  tokenName: string;
  amount: string;
  usdValue: string;
  mintAddress?: string | null;
  lastUpdated: Date;
}

export interface SolanaAddress extends Address {
  sol: number;
  solUsdValue: number;
}
