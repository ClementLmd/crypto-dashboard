export const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error('API_URL is not defined in environment variables');
}

export const api = {
  auth: {
    signIn: `${API_URL}/auth/login`,
    signUp: `${API_URL}/users/signup`,
    signOut: `${API_URL}/auth/logout`,
    checkSession: `${API_URL}/auth/check`,
  },
  addresses: {
    add: `${API_URL}/addresses/addAddress`,
    delete: `${API_URL}/addresses/deleteAddress`,
    get: `${API_URL}/addresses/getUserAddresses`,
    addSolanaAddress: `${API_URL}/addresses/addAddress/solana`,
  },
};
