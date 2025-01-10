import mongoose, { type Document } from 'mongoose';
import type { Address, AddressContent } from '../../../shared/types/address';
import { blockchains } from '../../../shared/types/blockchain';

export interface AddressDocument extends Address, Document {
  _id: string;
}

const addressContentSchema = new mongoose.Schema<AddressContent>({
  tokenSymbol: { type: String, required: true },
  tokenName: { type: String, required: true },
  amount: { type: Number, required: true },
  usdValue: { type: Number, required: true, default: 0 },
  totalUsdValue: { type: Number, required: true, default: 0 },
  lastUpdated: { type: Date, default: Date.now },
});

const addressSchema = new mongoose.Schema<AddressDocument>({
  address: { type: String, required: true },
  addressContent: { type: [addressContentSchema], default: [] },
  addressName: { type: String, default: null },
  blockchain: { type: String, enum: blockchains, required: true },
});

export const AddressModel = mongoose.model<AddressDocument>('Address', addressSchema);
