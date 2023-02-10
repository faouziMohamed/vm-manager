/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { getInstances } from '@/lib/server-only-utils';
import { VMInstance } from '@/lib/vmUtils';

let instances: VMInstance[] = [];

const handler = nc();

type NextApiRequestWithParams = NextApiRequest & {
  query: { vmId: string };
};

type ErrorResponse = {
  message: string;
};

handler.get(
  async (
    req: NextApiRequestWithParams,
    res: NextApiResponse<VMInstance | ErrorResponse>,
  ) => {
    const { vmId } = req.query;
    console.log('vmId', vmId);

    if (!vmId) {
      res
        .status(400)
        .json({ message: 'No Virtual Machine instance ID provided' });
      return;
    }
    // get all instances from
    instances = await getInstances();
    const instance = instances.find((i) => i.instanceId === vmId);
    if (!instance) {
      res.status(404).json({ message: 'Virtual Machine instance not found' });
      return;
    }
    res.json(instance);
  },
);

export default handler;
