import { createSolanaRpc, address } from '@solana/web3.js';
import { AddressContent } from '@shared/types/address';
import { getTokenPrice } from '../tokens/getTokenPrice';

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

    // Get SOL price
    const solPrice = await getTokenPrice('So11111111111111111111111111111111111111112');

    // Create SOL token entry
    const solToken: AddressContent = {
      tokenSymbol: 'SOL',
      tokenName: 'Solana',
      amount: Number(solBalance.value) / 1e9,
      usdValue: solPrice?.price || 0,
      totalUsdValue: (solPrice?.price || 0) * (Number(solBalance.value) / 1e9),
      lastUpdated: new Date(),
      mintAddress: 'So11111111111111111111111111111111111111112',
    };

    // Map and fetch prices for other tokens
    const tokens = await Promise.all(
      tokenAccounts.value
        // Filter known tokens first
        .map((account) => {
          const tokenInfo = account.account.data.parsed.info;
          const metadata = Object.values(tokenList).find((t) => t.address === tokenInfo.mint);

          if (!metadata || !tokenInfo.tokenAmount.uiAmount) return null;
          return { tokenInfo, metadata };
        })
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((item): item is { tokenInfo: any; metadata: any } => item !== null)
        // Then fetch prices only for known tokens
        .map(async ({ tokenInfo, metadata }) => {
          const price = await getTokenPrice(metadata.address);

          return {
            tokenSymbol: metadata.symbol,
            tokenName: metadata.name,
            amount: tokenInfo.tokenAmount.uiAmount,
            usdValue: price?.price || 0,
            totalUsdValue: (price?.price || 0) * tokenInfo.tokenAmount.uiAmount,
            lastUpdated: new Date(),
            mintAddress: tokenInfo.mint as string,
          };
        }),
    );

    return [solToken, ...tokens];
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}
