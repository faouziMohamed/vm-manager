// noinspection ExceptionCaughtLocallyJS

import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  deleteToken,
  existsUser,
  findTokenFromDb,
  setUserEmailVerified,
} from '@/lib/db/queries';
import { AppUser, ErrorResponse } from '@/lib/types';

interface NextRequestWithToken extends NextApiRequest {
  body: { token: string };
}

const handler = nc();
type AppUserWithUserId = Omit<AppUser, 'id'> & { userId: string };
handler.post(
  async (
    req: NextRequestWithToken,
    res: NextApiResponse<AppUserWithUserId | ErrorResponse>,
  ) => {
    try {
      const { token } = req.body;
      const payload = await findTokenFromDb(token);
      if (!payload) {
        throw new Error('Invalid token');
      }
      const { user } = payload as unknown as { user: AppUserWithUserId };
      // check if token is expired
      const now = new Date();
      if (now > payload.expires) {
        throw new Error('Token expired');
      }
      const userExists = await existsUser(user.userId);
      if (!userExists) {
        res.status(401).json({ message: 'User does not exist' });
        return;
      }
      const { userId } = user;
      await setUserEmailVerified(userId);
      await deleteToken(token);
      res.status(200).json(user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      const e = error as Error;
      res.status(400).json({ message: e.message });
    }
  },
);

export default handler;
