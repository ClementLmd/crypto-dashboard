import { getSolanaTokens } from '../use-cases/address/getSolanaTokens';

describe.skip('Solana Unit Tests', () => {
  // Known addresses with expected tokens
  const testAddresses = [
    'CpsUdHzAbmyvqf29AvT8cFEzW9AcyHdSDUi4pPGbykQg', // Address with multiple tokens
    '5YNmS1R9nNSCDzb5a7mMJ1dwK9uHeAAF4CmPEwKgVWr8', // Address with SOL
  ];

  // Increase timeout for RPC calls
  jest.setTimeout(15000);

  it('should fetch SOL balance', async () => {
    const result = await getSolanaTokens(testAddresses[1]);

    expect(result).toBeDefined();
    expect(result[0]).toMatchObject({
      tokenSymbol: 'SOL',
      tokenName: 'Solana',
      amount: expect.any(Number),
      lastUpdated: expect.any(Date),
    });
  });

  it('should fetch real token balances including metadata', async () => {
    const result = await getSolanaTokens(testAddresses[0]);

    expect(result.length).toBeGreaterThan(0);
    result.forEach((token) => {
      expect(token).toMatchObject({
        tokenSymbol: expect.any(String),
        tokenName: expect.any(String),
        amount: expect.any(Number),
        usdValue: expect.any(Number),
        totalUsdValue: expect.any(Number),
        lastUpdated: expect.any(Date),
      });
    });
  });

  it('should fetch Jupiter token list successfully', async () => {
    const response = await fetch('https://token.jup.ag/strict');
    const tokenList = await response.json();

    expect(tokenList).toBeDefined();
    expect(Object.keys(tokenList).length).toBeGreaterThan(0);
  });
});
