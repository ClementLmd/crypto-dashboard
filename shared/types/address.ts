import type { Blockchain } from './blockchain';
import type { Cryptocurrency } from './cryptocurrency';

export interface Address {
  addressName?: string;
  address: string;
  addressContent?: AddressContent[];
  blockchain: Blockchain;
}

export type AddressContent = {
  crypto: Cryptocurrency;
  quantity: number;
};
