/* eslint-disable no-console */
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { v4 as uuidv4 } from 'uuid';

import { addInstance } from '@/lib/server-only-utils';
import { FormValues, generateIpAddress } from '@/lib/utils';
import { VmShortDetails } from '@/lib/vmUtils';

const handler = nc();

type NextAPiRequestWithBody = NextApiResponse & { body: FormValues };
handler.post(
  async (
    req: NextAPiRequestWithBody,
    res: NextApiResponse<VmShortDetails[]>,
  ) => {
    const { serverName, region } = req.body;
    const newInstance: VmShortDetails = {
      id: uuidv4(),
      name: serverName,
      ipAddress: generateIpAddress(),
      status: 'creating',
      region,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    // validate the password
    // get all instances from
    res.json(await addInstance(newInstance));
  },
);

export default handler;
