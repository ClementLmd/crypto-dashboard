import { isAddress } from "@solana/web3.js";

export function isValidSolanaAddress(address: string): boolean {
  try {
    if (!isAddress(address)) return false;
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

// TODO: Implement Ethereum address validation
export function isValidEthereumAddress() {}

// TODO: Implement Bitcoin address validation
export function isValidBitcoinAddress() {}
