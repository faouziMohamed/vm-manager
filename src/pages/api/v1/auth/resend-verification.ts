import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';

import prisma from '@/lib/db/prisma';
import { existsUser } from '@/lib/db/queries';
import { authMiddleware } from '@/lib/middleware';
import { AppUser, ErrorResponse, SuccessResponse } from '@/lib/types';

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { sendVerificationEmail } from '@/Services/server/mail.service';

const handler = nc().use(authMiddleware);

handler.post(
  async (
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse | ErrorResponse>,
  ) => {
    const session = await getServerSession(req, res, nextAuthOptions);

    try {
      const user = session!.user as AppUser & { userId: string };
      const { id: userId } = user;
      const userExists = await existsUser(user.id);
      if (!userExists) {
        res.status(401).json({ message: 'User does not exist' });
        return;
      }
      await prisma!.verificationToken.deleteMany({
        where: { userId, kind: 'email' },
      });
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
