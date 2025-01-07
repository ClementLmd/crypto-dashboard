import { createSolanaRpc, address } from '@solana/web3.js';
import { AddressContent } from '@shared/types/address';

export async function getSolanaTokens(walletAddress: string): Promise<AddressContent[]> {
  const rpc = createSolanaRpc('https://api.mainnet-beta.solana.com');

  try {
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
    const tokenList = await tokenListResponse.json();

    // Map to AddressContent format
    const tokens = tokenAccounts.value
      .map((account) => {
        const tokenInfo = account.account.data.parsed.info;
        const metadata = Object.values(tokenList).find((t) => t.address === tokenInfo.mint);

        if (!metadata || !tokenInfo.tokenAmount.uiAmount) return null;

        return {
          tokenSymbol: metadata.symbol || 'Unknown',
          amount: tokenInfo.tokenAmount.uiAmount.toString(),
          usdValue: '0', // You'll need to implement price fetching
        };
      })
      .filter((token): token is AddressContent => token !== null);

    return tokens;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
