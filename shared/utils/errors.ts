export const errors = {
  addresses: {
    incompleteData: 'Missing or empty fields.',
    failedDelete: 'Failed address delete.',
    invalidSolanaAddress: 'Invalid Solana address.',
  },
  internal: 'Internal server error.',
  users: {
    incompleteData: 'Missing or empty fields.',
    incorrectPasswordFormat:
      'Password must be at least 7 characters long, and include at least one uppercase letter, one lowercase letter, and one number.',
    duplicatedUsername: 'Username already exists.',
    wrongPassword: 'Wrong password.',
    userNotFound: 'User not found.',
    unauthorized: 'User is not authenticated',
  },
  session: {
    invalidSession: 'Invalid or expired session',
    invalidCredentials: 'Invalid credentials',
  },
};
