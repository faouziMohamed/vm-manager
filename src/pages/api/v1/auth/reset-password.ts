import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { corsMiddleware } from '@/lib/middleware';
import { jwtDecode } from '@/lib/server.utils';

import {
  deleteVerificationTokenOfKind,
  getUserByEmail,
  updateUserPassword,
} from '@/Repository/queries';
import {
  PasswordResetPayload,
  sendPasswordResetEmail,
} from '@/Services/server/mail.service';

const handler = nc() //
  .use(corsMiddleware());

interface NextApiRequestWithQuery extends NextApiRequest {
  query: {
    email: string;
  };
}

handler.get(async (req: NextApiRequestWithQuery, res: NextApiResponse) => {
  const { email } = req.query;
  if (!email) {
    res.status(400).json({ message: 'Email is required' });
  }

  try {
    const user = await getUserByEmail(email);
    if (!user) {
      res
        .status(404)
        .json({ message: 'The user with the given email was not found' });
      return;
    }
    await deleteVerificationTokenOfKind(user.userId, 'password');

    await sendPasswordResetEmail(email, user.userId);
    res.status(200).json({ message: 'Email sent' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
});
interface NextApiRequestWithBody extends NextApiRequest {
  body: { token: string; password: string };
}

handler.post(async (req: NextApiRequestWithBody, res: NextApiResponse) => {
  const { token, password } = req.body;
  if (!token || !password) {
    res.status(400).json({ message: 'Token and password are required' });
  }

  try {
    const decoded = jwtDecode<PasswordResetPayload>(token);
    if (!decoded) {
      res.status(401).json({ message: 'Invalid token' });
      return;
    }
    const user = await getUserByEmail(decoded.email);
    if (!user) {
      res
        .status(404)
        .json({ message: 'The user with the given email was not found' });
      return;
    }
    await deleteVerificationTokenOfKind(user.userId, 'password');
    await updateUserPassword(user.userId, password);
    res.status(200).json({ message: 'Password updated' });
  } catch (err) {
    const error = err as Error;
    res.status(500).json({ message: error.message });
  }
});

export default handler;
