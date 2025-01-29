import type { Address } from './address';

export interface SigningUpUser {
  username: string;
  password: string;
}

export interface User extends SigningUpUser {
  _id: string;
  email?: string;
  createdAt: Date;
  addresses: Address[];
}

export interface ConnectedUser {
  username: string;
}
