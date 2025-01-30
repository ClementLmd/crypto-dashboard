import { createSolanaRpc, address } from '@solana/web3.js';

interface TokenMetadata {
  symbol: string;
  name: string;
  decimals: number;
  address: string; // mint address
}

async function getTokenBalances(walletAddress: string) {
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
    const tokenListResponse = await fetch('https://token.jup.ag/strict'); // Using strict list for better data
    const tokenList: Record<string, TokenMetadata> = await tokenListResponse.json();

    // Map the results to readable format
    const tokens = tokenAccounts.value.map((account) => {
      const tokenInfo = account.account.data.parsed.info;
      const metadata = Object.values(tokenList).find((t) => t.address === tokenInfo.mint);

      return {
        tokenAccount: account.pubkey,
        mint: tokenInfo.mint,
        symbol: metadata?.symbol || 'Unknown',
        name: metadata?.name || 'Unknown Token',
        amount: tokenInfo.tokenAmount.amount,
        decimals: tokenInfo.tokenAmount.decimals,
        uiAmount: tokenInfo.tokenAmount.uiAmount,
      };
    });

    return {
      sol: Number(solBalance.value) / 1e9,
      tokens: tokens.filter((t) => t.uiAmount && t.uiAmount > 0), // Only show tokens with balance
    };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Test function
async function testAddress(walletAddress: string) {
  console.log('Testing address:', walletAddress);
  try {
    const result = await getTokenBalances(walletAddress);
    console.log('\nSOL Balance:', result.sol, 'SOL');
    console.log('\nTokens:');
    result.tokens.forEach((token) => {
      console.log(`
        Token: ${token.name} (${token.symbol})
        Amount: ${token.uiAmount ? token.uiAmount.toLocaleString() : '0'} ${token.symbol}
        Mint: ${token.mint}
        Account: ${token.tokenAccount}
        Decimals: ${token.decimals}
      `);
    });
  } catch (err) {
    console.error('Error:', err);
  }
}

// Run the test
const testWallet = 'CpsUdHzAbmyvqf29AvT8cFEzW9AcyHdSDUi4pPGbykQg';
testAddress(testWallet);
