import bcrypt from 'bcrypt';
import { sign, verify } from 'jsonwebtoken';
import { NextApiRequest } from 'next';
import { getToken } from 'next-auth/jwt';

import { AppUser } from '@/lib/types';

// Hashes the password using bcrypt
export function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

// Verifies the password against the hash using bcrypt
export function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function jwtSignData(payload: Record<string, unknown>) {
  const key = process.env.NEXTAUTH_SECRET!;
  const expires = '2h';
  return sign(payload, key, { expiresIn: expires });
}
export function jwtDecode<TJwtDecode extends Record<string, unknown>>(
  token: string,
): TJwtDecode | null {
  try {
    const key = process.env.NEXTAUTH_SECRET!;
    const payload = verify(token, key);
    return payload as TJwtDecode;
  } catch (err) {
    return null;
  }
}
export async function getUserFromRequest(req: NextApiRequest) {
  const token = (await getToken({ req }))!;
  return token.user as AppUser;
}
