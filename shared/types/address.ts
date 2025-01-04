import type { Blockchain } from './blockchain';
import type { Cryptocurrency } from './cryptocurrency';

export interface Address {
  _id?: string;
  addressName?: string | null;
  address: string;
  addressContent?: AddressContent[];
  blockchain: Blockchain;
}

export type AddressContent = {
  crypto: Cryptocurrency;
  quantity: number;
};
