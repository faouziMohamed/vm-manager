/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';

import { getUserSavedVirtualMachines } from '@/lib/db/queries';
import { authMiddleware } from '@/lib/middleware';
import { ErrorResponse } from '@/lib/types';

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { getVirtualMachine } from '@/Services/server/azureService/azure.service';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

// let instances: CreateVmResult[] = [];

const handler = nc().use(authMiddleware);

handler.get(
  async (
    req: NextApiRequest,
    res: NextApiResponse<CreateVmResult[] | ErrorResponse>,
  ) => {
    const session = await getServerSession(req, res, nextAuthOptions);
    try {
      // get all instances data, for the current user, from the database
      const userId = session!.user!.id;
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
      // get all instances from
      // instances = (await getInstances()) as unknown as CreateVmResult[];
      res.json(azureInstancesResults);
    } catch (error) {
      const e = error as Error;
      console.log(error);
      res.status(500).json({ message: e.message });
    }
  },
);

export default handler;
