import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse, SuccessResponse } from '@/lib/types';

import {
  deleteVerificationTokenOfKind,
  updateUserEmail,
} from '@/Repository/queries';
import { sendVerificationMail } from '@/Services/server/mail.service';

const handler = nc().use(authMiddleware);

interface RequestWithBodyEmail extends NextApiRequest {
  body: { email?: string };
}

handler.put(
  async (
    req: RequestWithBodyEmail,
    res: NextApiResponse<SuccessResponse | ErrorResponse>,
  ) => {
    const user = await getUserFromRequest(req);
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ message: 'Email is required' });
      return;
    }
    if (email === user.email) {
      res.status(400).json({ message: 'Email is already in use' });
      return;
    }
    try {
      const { id: userId } = user;
      await updateUserEmail(userId, email);
      await deleteVerificationTokenOfKind(userId);
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
      await sendVerificationMail(user);
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
