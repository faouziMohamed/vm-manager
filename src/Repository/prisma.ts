/* eslint-disable @typescript-eslint/ban-ts-comment,@typescript-eslint/no-unsafe-assignment */

import { PrismaClient } from '@prisma/client';

// @ts-ignore: Unreachable error
const prisma = (globalThis.prisma || new PrismaClient()) as
  | PrismaClient
  | undefined;
// @ts-ignore: Unreachable error
if (process.env.NODE_ENV !== 'production') globalThis.prisma = prisma;

export default prisma;
