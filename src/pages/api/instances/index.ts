/* eslint-disable no-console */
import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { getInstances } from '@/lib/server-only-utils';
import { VMInstance } from '@/lib/vmUtils';

let instances: VMInstance[] = [];

const handler = nc();

handler.get(async (req, res: NextApiResponse<VMInstance[]>) => {
  // get all instances from
  instances = await getInstances();
  res.json(instances);
});

export default handler;
