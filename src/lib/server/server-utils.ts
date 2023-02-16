import bcrypt from 'bcrypt';
import { readFile, stat, writeFile } from 'fs/promises';
import { sign } from 'jsonwebtoken';
import path from 'path';

import { VMInstance } from '@/lib/types';
import { sortData } from '@/lib/utils';

export async function checkFileExists(fileName: string): Promise<boolean> {
  try {
    await stat(fileName);
    return true;
  } catch (error) {
    return false;
  }
}

const jsonInstancesDb = path.join(process.cwd(), 'instances.json');
const instances: VMInstance[] = [];

export async function getInstances() {
  try {
    if (process.env.NODE_ENV !== 'development') {
      return instances;
    }
    // if file does not exist, create it
    if (!(await checkFileExists(jsonInstancesDb))) {
      await writeFile(jsonInstancesDb, JSON.stringify([]));
      return [];
    }
    const json = await readFile(jsonInstancesDb, 'utf8');
    return JSON.parse(json) as VMInstance[];
  } catch (err) {
    const error = err as Error;
    // eslint-disable-next-line no-console
    console.error(
      'error reading instances from file',
      error.cause,
      error.message,
    );
    return [];
  }
}

export async function addInstance(newInstance: VMInstance) {
  try {
    if (process.env.NODE_ENV !== 'development') {
      instances.push(newInstance);
      return instances;
    }
    const allInstances = await getInstances();
    allInstances.push(newInstance);
    const sortedInstances = allInstances.sort((a, b) =>
      sortData('createdAt', a, b, 'desc'),
    );

    // const instances = (await getInstances())
    await writeFile(jsonInstancesDb, JSON.stringify(sortedInstances));
    return sortedInstances;
  } catch (err) {
    const error = err as Error;
    // eslint-disable-next-line no-console
    console.error('error adding instance to file', error.cause, error.message);
    return [];
  }
}

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