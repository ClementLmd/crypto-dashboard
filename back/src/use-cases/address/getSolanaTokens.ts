import { createSolanaRpc, address } from '@solana/web3.js';
import { AddressContent } from '@shared/types/address';

interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
  address: string; // mint address
}

export async function getSolanaTokens(walletAddress: string): Promise<AddressContent[]> {
  const rpc = createSolanaRpc('https://api.mainnet-beta.solana.com');

  try {
    const solBalance = await rpc.getBalance(address(walletAddress)).send();

    // Get token accounts with parsed data
    const tokenAccounts = await rpc
      .getTokenAccountsByOwner(
        address(walletAddress),
        {
          programId: address('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        },
        { encoding: 'jsonParsed' },
      )
      .send();

    // Get token metadata from Jupiter API
    const tokenListResponse = await fetch('https://token.jup.ag/strict');
    const tokenList: Record<string, TokenMetadata> = await tokenListResponse.json();

    // Map to AddressContent format
    const tokens = tokenAccounts.value
      .map((account) => {
        const tokenInfo = account.account.data.parsed.info;
        const metadata = Object.values(tokenList).find((t) => t.address === tokenInfo.mint);

        if (!metadata || !tokenInfo.tokenAmount.uiAmount) return null;

        return {
          tokenSymbol: metadata.symbol || 'Unknown',
          tokenName: metadata.name || 'Unknown Token',
          amount: tokenInfo.tokenAmount.uiAmount.toString(),
          usdValue: '0', // TODO: Implement price fetching
          mintAddress: tokenInfo.mint,
          decimals: tokenInfo.tokenAmount.decimals,
          lastUpdated: new Date(),
        };
      })
      .filter((token): token is AddressContent => token !== null);

    return {
      sol: Number(solBalance.value) / 1e9,
      tokens: tokens.filter((t) => t.uiAmount && t.uiAmount > 0), // Only show tokens with balance
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
