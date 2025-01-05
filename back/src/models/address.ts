import mongoose, { type Document } from 'mongoose';
import type { Address, AddressContent } from '../../../shared/types/address';
import { blockchains } from '../../../shared/types/blockchain';
import type { Cryptocurrency } from '../../../shared/types/cryptocurrency';

export interface AddressDocument extends Address, Document {
  _id: string;
}

const cryptocurrencySchema = new mongoose.Schema<Cryptocurrency>({
  cryptoName: { type: String, required: true },
  price: { type: Number, required: true },
});

const addressContentSchema = new mongoose.Schema<AddressContent>({
  crypto: { type: cryptocurrencySchema, required: true },
  quantity: { type: Number, required: true },
});

const addressSchema = new mongoose.Schema<AddressDocument>({
  address: { type: String, required: true },
  addressContent: { type: [addressContentSchema] },
  addressName: { type: String, default: null },
  blockchain: { type: String, enum: blockchains, required: true },
});

export const AddressModel = mongoose.model<AddressDocument>('Address', addressSchema);
