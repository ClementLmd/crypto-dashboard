import mongoose, { type Document } from 'mongoose';
import type { Address, AddressContent, SolanaAddress } from '../../../shared/types/address';
import { blockchains } from '../../../shared/types/blockchain';

export interface AddressDocument extends Address, Document {
  _id: string;
}

const addressContentSchema = new mongoose.Schema<AddressContent>({
  tokenSymbol: { type: String, required: true },
  tokenName: { type: String, required: true },
  amount: { type: String, required: true },
  usdValue: { type: String, required: true },
  mintAddress: { type: String },
  lastUpdated: { type: Date, default: Date.now },
});

const addressSchema = new mongoose.Schema<AddressDocument>({
  address: { type: String, required: true },
  addressContent: { type: [addressContentSchema], default: [] },
  addressName: { type: String, default: null },
  blockchain: { type: String, enum: blockchains, required: true },
});

const solanaAddressSchema = new mongoose.Schema<SolanaAddress>({
  address: { type: String, required: true },
  addressContent: { type: [addressContentSchema], default: [] },
  addressName: { type: String, default: null },
  blockchain: { type: String, enum: blockchains, required: true },
  sol: { type: Number, required: true },
  solUsdValue: { type: Number, required: true },
});

export const AddressModel = mongoose.model<AddressDocument>('Address', addressSchema);
export const SolanaAddressModel = mongoose.model<SolanaAddress>(
  'SolanaAddress',
  solanaAddressSchema,
);
