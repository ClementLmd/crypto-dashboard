const API_URL = 'http://localhost:3001';

export const checkSession = async () => {
  const response = await fetch(`${API_URL}/auth/check`, {
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Session invalid');
  return await response.json();
};
