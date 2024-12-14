import argon2 from 'argon2';

export async function hashPassword(password: string): Promise<string> {
  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 2 ** 16,
    timeCost: 3,
    parallelism: 1,
  });
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  try {
    const isMatch = await argon2.verify(hash, password);
    return isMatch;
  } catch (error) {
    console.error('Error verifying password:', error);
    throw error;
  }
}
