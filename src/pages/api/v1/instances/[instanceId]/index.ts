/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { getOneUserSavedVirtualMachine } from '@/lib/db/queries';
import { ResourceNotFoundError } from '@/lib/Exceptions/azure.exceptions';
import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse } from '@/lib/types';

import { getVirtualMachine } from '@/Services/server/azureService/azure.service';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

const handler = nc().use(authMiddleware);

interface NextApiRequestWithParams extends NextApiRequest {
  query: { instanceId: string };
}

handler.get(
  async (
    req: NextApiRequestWithParams,
    res: NextApiResponse<CreateVmResult | ErrorResponse>,
  ) => {
    const { instanceId } = req.query;
    if (!instanceId) {
      res
        .status(400)
        .json({ message: 'No Virtual Machine instance ID provided' });
      return;
    }
    const user = await getUserFromRequest(req);
    const userId = user.id;
    try {
      const instance = await getOneUserSavedVirtualMachine(userId, instanceId);
      if (!instance) {
        const message =
          'Virtual Machine instance not found, or not owned by the user';
        res.status(404).json({ message });
        return;
      }
      const azureInstance = await getVirtualMachine(
        instance.resourceGroupName,
        instance.computerName,
        instance.publicIpName,
        instance.serverName,
      );
      azureInstance.isFavorite = instance.isFavorite;
      res.json(azureInstance);
    } catch (error) {
      const e = error as Error;
      if (e instanceof ResourceNotFoundError) {
        res.status(404).json({ message: e.message });
        return;
      }

      console.log(error);
      res.status(500).json({ message: e.message });
    }
  },
);

export default handler;
