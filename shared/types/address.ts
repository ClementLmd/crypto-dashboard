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
  amount: number;
  usdValue: number;
  totalUsdValue: number;
  lastUpdated: Date;
}
