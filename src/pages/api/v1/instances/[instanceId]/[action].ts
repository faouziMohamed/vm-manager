/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import {
  deleteVirtualMachine,
  getOneUserSavedVirtualMachine,
  updateVmInstanceFavoriteStatus,
} from '@/lib/db/queries';
import { authMiddleware } from '@/lib/middleware';
import { getUserFromRequest } from '@/lib/server.utils';
import { ErrorResponse } from '@/lib/types';

import { MANAGE_VM_ACTIONS } from '@/Services/server/azureService/azure.constants';
import { manageVirtualMachine } from '@/Services/server/azureService/azure.service';
import {
  CreateVmResult,
  ManageVmAction,
} from '@/Services/server/azureService/azure.types';

const handler = nc().use(authMiddleware);

interface NextApiRequestWithParams extends NextApiRequest {
  query: { instanceId: string; action: string };
}

type ActionSuccessResponse = {
  message: string;
};

handler.put(
  async (
    req: NextApiRequestWithParams,
    res: NextApiResponse<
      CreateVmResult | ActionSuccessResponse | ErrorResponse
    >,
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
    // Get the action to be performed on the instance
    const { action: a } = req.query;
    const action = a.toLowerCase() as ManageVmAction;
    const favoriteAction = a.toLowerCase() as 'favorite';

    if (!MANAGE_VM_ACTIONS.includes(action) && favoriteAction !== 'favorite') {
      const message =
        `Invalid action: ${action},` + //
        ` allowed actions are: ${MANAGE_VM_ACTIONS.join(', ')}, favorite`;

      res.status(400).json({ message });
      return;
    }
    try {
      const instance = await getOneUserSavedVirtualMachine(userId, instanceId);
      if (!instance) {
        const message = `Virtual Machine instance not found, or not owned by the user`;
        res.status(404).json({ message });
        return;
      }

      if (favoriteAction === 'favorite') {
        await updateVmInstanceFavoriteStatus(instanceId, !instance.isFavorite);
        res.status(200).json({ message: 'Favorite status updated' });
        return;
      }

      // Run the action on the instance
      const { resourceGroupName: rgName, computerName: vmName } = instance;
      await manageVirtualMachine(rgName, vmName, action);
      // particular case
      if (action === 'delete') {
        await deleteVirtualMachine(instanceId);
      }

      const msg = `Virtual Machine ${instance.serverName} is ${action}ed successfully`;
      res.status(200).json({ message: msg });
    } catch (error) {
      const e = error as Error;
      console.log(error);
      res.status(500).json({ message: e.message });
    }
  },
);

export default handler;
