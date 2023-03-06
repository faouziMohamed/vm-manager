import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse, SuccessResponse } from '@/lib/types';

import {
  deleteVerificationTokenOfKind,
  existsUser,
} from '@/Repository/queries';
import { sendVerificationMail } from '@/Services/server/mail.service';

const handler = nc().use(authMiddleware);

handler.post(
  async (
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse | ErrorResponse>,
  ) => {
    try {
      const user = await getUserFromRequest(req);
      const { id: userId } = user;
      const userExists = await existsUser(user.id);
      if (!userExists) {
        res.status(401).json({ message: 'User does not exist' });
        return;
      }
      await deleteVerificationTokenOfKind(userId);
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
