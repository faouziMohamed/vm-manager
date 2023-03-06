import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { updateUserAvatar } from '@/lib/db/queries';
import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse, SuccessResponse } from '@/lib/types';

import {
  handleUploadedFile,
  uploadUserAvatar,
} from '@/Services/server/upload.service';

export const config = {
  api: { bodyParser: false },
};

const handler = nc().use(authMiddleware);

handler.put(
  async (
    req: NextApiRequest,
    res: NextApiResponse<SuccessResponse | ErrorResponse>,
  ) => {
    const user = await getUserFromRequest(req);
    try {
      const { id: userId } = user;
      handleUploadedFile(req, userId, (file, err) => {
        if (err) {
          res.status(400).json({ message: err });
          return;
        }
        // eslint-disable-next-line promise/always-return
        void uploadUserAvatar(file!).then(async (uploadedImage) => {
          await updateUserAvatar(userId, uploadedImage.url);
          res.status(200).json({ message: 'Image uploaded' });
        });
      });
    } catch (error) {
      const e = error as PrismaClientKnownRequestError;
      if ('code' in e && e.code === 'P2025') {
        const msg = "Couldn't update image, your account doesn't exist anymore";
        res.status(401).json({ message: msg });
        return;
      }
      res.status(500).json({ message: `Something went wrong\n${e.message}` });
    }
  },
);
export default handler;
