/* eslint-disable no-console */
import { verifySignature } from '@upstash/qstash/nextjs';
import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { corsMiddleware } from '@/lib/middleware';

import {
  deleteExpiredVerificationTokens,
  deleteUnverifiedUsers,
} from '@/Services/server/auth.service';

const handler = nc().use(corsMiddleware());

handler.post(async (req, res: NextApiResponse) => {
  console.log(
    'Cleaning up expired verification tokens and unverified users...',
  );
  try {
    // eslint-disable-next-line no-console
    await deleteUnverifiedUsers();
  } catch (error) {
    const e = error as Error;
    console.log(
      'An error occurred while deleting unverified users: ',
      e.message,
    );
    res.status(500).json({ message: e.message });
  }

  try {
    await deleteExpiredVerificationTokens();
  } catch (error) {
    const e = error as Error;
    console.log(
      'An error occurred while deleting expired verification tokens: ',
      e.message,
    );
    res.status(500).json({ message: e.message });
  }
  res.status(200).json({ message: 'Tasks completed' });
});

export default verifySignature(handler, {
  currentSigningKey: process.env.UPSTASH_SIGNING_KEY!,
  nextSigningKey: process.env.UPSTASH_SIGNING_KEY!,
  url: process.env.NEXT_PUBLIC_SITE_URL!,
});
