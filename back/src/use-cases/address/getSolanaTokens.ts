import { createSolanaRpc, address } from '@solana/web3.js';
import { AddressContent } from '@shared/types/address';

interface JupiterTokenInfo {
  symbol: string;
  name: string;
  address: string;
  decimals: number;
}

export async function getSolanaTokens(walletAddress: string): Promise<AddressContent[]> {
  const rpc = createSolanaRpc('https://api.mainnet-beta.solana.com');

  try {
    // Get SOL balance
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
    const tokenList: Record<string, JupiterTokenInfo> = await tokenListResponse.json();

    // Create SOL token entry
    const solToken: AddressContent = {
      tokenSymbol: 'SOL',
      tokenName: 'Solana',
      amount: Number(solBalance.value) / 1e9, // Convert lamports to SOL
      usdValue: 0, // TODO: Implement price fetching
      lastUpdated: new Date(),
      totalUsdValue: 0,
    };

    // Map other tokens
    const tokens = tokenAccounts.value
      .map((account) => {
        const tokenInfo = account.account.data.parsed.info;
        const metadata = Object.values(tokenList).find((t) => t.address === tokenInfo.mint);

        if (!metadata || !tokenInfo.tokenAmount.uiAmount) return null;

        return {
          tokenSymbol: metadata.symbol || 'Unknown',
          tokenName: metadata.name || 'Unknown Token',
          amount: tokenInfo.tokenAmount.uiAmount,
          usdValue: 0, // TODO: Implement price fetching
          totalUsdValue: 0,
          lastUpdated: new Date(),
        };
      })
      .filter((token): token is AddressContent => token !== null);

    // Combine SOL with other tokens
    return [solToken, ...tokens];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
