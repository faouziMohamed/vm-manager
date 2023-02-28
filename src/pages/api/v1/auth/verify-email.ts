import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import prisma from '@/lib/db/prisma';
import { AppUser, ErrorResponse } from '@/lib/types';

type NextRequestWithToken = NextApiRequest & { token: string };
const handler = nc();

async function setUserEmailVerified(userId: string) {
  const now = new Date();
  await prisma!.user.update({
    where: { userId },
    data: { emailVerified: now },
    select: {
      userId: true,
      email: true,
      firstname: true,
      lastname: true,
    },
  });
}

async function deleteToken(token: string) {
  await prisma!.verificationToken.delete({
    where: { token },
  });
}

function findTokenFromDb(token: string) {
  return prisma!.verificationToken.findUnique({
    where: { token },
    include: {
      user: {
        select: {
          userId: true,
          email: true,
          firstname: true,
          lastname: true,
        },
      },
    },
  });
}

handler.post(
  async (
    req: NextRequestWithToken,
    res: NextApiResponse<AppUser | ErrorResponse>,
  ) => {
    try {
      const { token } = req.body as { token: string };
      const payload = await findTokenFromDb(token);
      if (!payload) {
        throw new Error('Invalid token');
      }
      const { user } = payload as unknown as {
        user: AppUser & { userId: string };
      };
      // check if token is expired
      const now = new Date();
      if (now > payload.expires) {
        throw new Error('Token expired');
      }
      const { userId } = user;
      await setUserEmailVerified(userId);
      await deleteToken(token);
      res.json(user);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      const e = error as Error;
      res.status(400).json({ message: e.message });
    }
  },
);

export default handler;
