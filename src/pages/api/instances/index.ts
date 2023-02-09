/* eslint-disable no-console */
import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { getInstances } from '@/lib/server-only-utils';
import { VmShortDetails } from '@/lib/vmUtils';

let instances: VmShortDetails[] = [];

const handler = nc();

handler.get(async (req, res: NextApiResponse<VmShortDetails[]>) => {
  // get all instances from
  instances = await getInstances();
  res.json(instances);
});

export default handler;
