/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse } from '@/lib/types';

import { getUserSavedVirtualMachines } from '@/Repository/queries';
import { getVirtualMachine } from '@/Services/server/azureService/azure.service';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

const handler = nc().use(authMiddleware);

handler.get(
  async (
    req: NextApiRequest,
    res: NextApiResponse<CreateVmResult[] | ErrorResponse>,
  ) => {
    try {
      const user = await getUserFromRequest(req);
      // get all instances data, for the current user, from the database
      const userId = user.id;
      const userInstances = await getUserSavedVirtualMachines(userId);
      // get all instances from azure
      const azureInstances = userInstances.map((instance) => {
        return getVirtualMachine(
          instance.resourceGroupName,
          instance.computerName,
          instance.publicIpName,
          instance.serverName,
        );
      });
      // wait for all instances to be fetched
      const azureInstancesResults = await Promise.all(azureInstances);
      res.json(azureInstancesResults);
    } catch (error) {
      const e = error as Error;
      console.log(error);
      res.status(500).json({ message: e.message });
    }
  },
);

export default handler;
