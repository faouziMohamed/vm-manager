/* eslint-disable no-console */
import { NextApiRequest, NextApiResponse } from 'next';
import nc from 'next-connect';

import { getInstances } from '@/lib/server/server-utils';
import { VMInstance } from '@/lib/types';

let instances: VMInstance[] = [];

const handler = nc();

type NextApiRequestWithParams = NextApiRequest & {
  query: { instanceId: string };
};

export type ErrorResponse = {
  message: string;
};

handler.get(
  async (
    req: NextApiRequestWithParams,
    res: NextApiResponse<VMInstance | ErrorResponse>,
  ) => {
    const { instanceId } = req.query;
    if (!instanceId) {
      res
        .status(400)
        .json({ message: 'No Virtual Machine instance ID provided' });
      return;
    }
    // get all instances from
    instances = await getInstances();
    const instance = instances.find((i) => i.instanceId === instanceId);
    if (!instance) {
      res.status(404).json({ message: 'Virtual Machine instance not found' });
      return;
    }
    res.json(instance);
  },
);

export default handler;
