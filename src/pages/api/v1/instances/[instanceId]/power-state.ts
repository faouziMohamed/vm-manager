/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth';
import nc from 'next-connect';

import { getOneUserSavedVirtualMachine } from '@/lib/db/queries';
import { authMiddleware } from '@/lib/middleware';
import { ErrorResponse } from '@/lib/types';

import { nextAuthOptions } from '@/pages/api/auth/[...nextauth]';
import { getVmPowerState } from '@/Services/server/azureService/azure.service';

const handler = nc().use(authMiddleware);

type NextApiRequestWithParams = NextApiRequest & {
  query: { instanceId: string };
};

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
    const session = await getServerSession(req, res, nextAuthOptions);
    const userId = session!.user!.id;

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
