import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';
import { PrismaClientKnownRequestError } from 'prisma/prisma-client/runtime';

import prisma from '@/lib/db/prisma';
import { authMiddleware } from '@/lib/middleware';
import { AppUser, ErrorResponse, SuccessResponse } from '@/lib/types';

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { sendVerificationEmail } from '@/Services/server/mail.service';

const handler = nc().use(authMiddleware);

interface RequestWithBodyEmail extends NextApiRequest {
  body: { email?: string };
}

handler.put(
  async (
    req: RequestWithBodyEmail,
    res: NextApiResponse<SuccessResponse | ErrorResponse>,
  ) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    if (email === session!.user!.email) {
      res.status(400).json({ message: 'Email is already in use' });
      return;
    }
    const user = session!.user as AppUser;
    try {
      const { id: userId } = user;
      await prisma!.user.update({
        where: { userId },
        data: { email },
      });

      await prisma!.verificationToken.deleteMany({
        where: { userId, kind: 'email' },
      });
    } catch (error) {
      const e = error as PrismaClientKnownRequestError;
      if ('code' in e && e.code === 'P2025') {
        const msg = "Couldn't update email, your account doesn't exist anymore";
        res.status(401).json({ message: msg });
        return;
      }
      res.status(500).json({ message: 'Something went wrong' });
      return;
    }
    try {
      await sendVerificationEmail(user);
      res.status(200).json({ message: 'Verification email sent' });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      const e = error as Error;
      res.status(400).json({ message: e.message });
    }
  },
);

export default handler;
