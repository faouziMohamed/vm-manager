/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';

import { saveNewVirtualMachine } from '@/lib/db/queries';
import { authMiddleware } from '@/lib/middleware';
import { ErrorResponse, NewVmValues } from '@/lib/types';

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { createVirtualMachine } from '@/Services/server/azureService/azure.service';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

const handler = nc().use(authMiddleware);

type NextAPiRequestWithBody = NextApiResponse & { body: NewVmValues };

handler.post(
  async (
    req: NextAPiRequestWithBody,
    res: NextApiResponse<CreateVmResult | ErrorResponse>,
  ) => {
    const { vmUsername: adminUsername, password } = req.body;
    const { serverName, region, machineName } = req.body;

    if (!adminUsername || !password || !serverName || !region || !machineName) {
      res.status(400).json({ message: 'Missing required fields' });
      return;
    }
    const tempReq = req as unknown as NextApiRequest;
    try {
      // arriving here means the user is authenticated see authMiddleware
      const session = await getServerSession(tempReq, res, nextAuthOptions);
      const instance = await createVirtualMachine(
        machineName,
        region,
        adminUsername,
        password,
      );
      const userId = session!.user!.id;
      await saveNewVirtualMachine(userId, instance, serverName);
      res.status(201).json(instance);
    } catch (error) {
      const e = error as Error;
      console.log('\n\nError \n');
      console.log(e);
      res.status(500).json({ message: e.message });
    }
  },
);

export default handler;
