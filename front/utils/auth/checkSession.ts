export async function checkSession(): Promise<boolean> {
  try {
    const response = await fetch('http://localhost:3001/auth/check', {
      credentials: 'include',
    });
    return response.ok;
  } catch {
    return false;
  }
}
