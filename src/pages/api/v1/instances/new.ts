/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse, NewVmValues } from '@/lib/types';

import { saveNewVirtualMachine } from '@/Repository/queries';
import { createVirtualMachine } from '@/Services/server/azureService/azure.service';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

const handler = nc().use(authMiddleware);

interface NextAPiRequestWithBody extends NextApiRequest {
  body: NewVmValues;
}

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
    try {
      // arriving here means the user is authenticated see authMiddleware
      const user = await getUserFromRequest(req);
      const instance = await createVirtualMachine(
        machineName,
        region,
        adminUsername,
        password,
      );
      const userId = user.id;
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
