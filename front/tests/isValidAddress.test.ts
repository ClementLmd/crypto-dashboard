import { isValidSolanaAddress } from 'shared';

describe('isValidSolanaAddress', () => {
  it('should return true for valid Solana addresses', () => {
    const validAddresses = [
      'GsbwXfJraMomNxBcpR3DBNxnqcNtKLQb9ZedrcgT5F8F',
      '6NvQ7xJZmi48jVdL8nzvEKcgXGwJPBs9aDjHPrnooRL8',
    ];

    validAddresses.forEach((address) => {
      expect(isValidSolanaAddress(address)).toBe(true);
    });
  });

  it('should return false for invalid addresses', () => {
    const invalidAddresses = [
      '',
      'not-an-address',
      '0x123', // Ethereum format
      // Add more invalid cases
    ];

    invalidAddresses.forEach((address) => {
      expect(isValidSolanaAddress(address)).toBe(false);
    });
  });
});
