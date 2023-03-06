// make sure the user is logged in before allowing them to access the page they requested

import Cors from 'cors';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import nc, { NextHandler } from 'next-connect';

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
  // const session = await getServerSession(req, res, nextAuthOptions);
  const token = await getToken({ req });
  if (!token || !token.user) {
    const message =
      'You need to be authenticated in order to access this endpoint.';
    res.status(401).json({ message });
  } else {
    next();
  }
}
