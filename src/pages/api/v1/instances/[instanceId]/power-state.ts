/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse } from '@/lib/types';

import { getOneUserSavedVirtualMachine } from '@/Repository/queries';
import { getVmPowerState } from '@/Services/server/azureService/azure.service';

const handler = nc().use(authMiddleware);

interface NextApiRequestWithParams extends NextApiRequest {
  query: { instanceId: string };
}

handler.get(
  async (
    req: NextApiRequestWithParams,
    res: NextApiResponse<ErrorResponse | { powerState: string }>,
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
        const message = `Virtual Machine instance not found, or not owned by the user`;
        res.status(404).json({ message });
        return;
      }
      const { resourceGroupName, computerName } = instance;
      const state = await getVmPowerState(resourceGroupName, computerName);
      if (!state) {
        res.status(404).json({ message: 'Virtual Machine instance not found' });
        return;
      }
      res.status(200).json({ powerState: state });
    } catch (error) {
      const e = error as Error;
      console.log(error);
      res.status(500).json({ message: e.message });
    }
  },
);

export default handler;
