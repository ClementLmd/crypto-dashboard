export const blockchains = ['Bitcoin', 'Ethereum', 'Solana'] as const;

export type Blockchain = (typeof blockchains)[number];
