import bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';

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
