// make sure the user is logged in before allowing them to access the page they requested

import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import nc, { NextHandler } from 'next-connect';

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';

export const authMiddleware = nc() //
  .use(corsMiddleware())
  .use(nextAuthSession);

export function corsMiddleware() {
  return Cors({
    methods: ['GET', 'POST', 'PUT'],
    origin: true,
    credentials: true,
  });
}

async function nextAuthSession(
  req: NextApiRequest,
  res: NextApiResponse,
  next: NextHandler,
) {
  const session = await getServerSession(req, res, nextAuthOptions);
  if (!session) {
    const message =
      'You need to be authenticated in order to access this endpoint.';
    res.status(401).json({ message });
  } else {
    next();
  }
}
