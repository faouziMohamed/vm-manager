/* eslint-disable no-console */
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import { v4 as uuidv4 } from 'uuid';

import { addInstance } from '@/lib/server-only-utils';
import { FormValues, generateIpAddress } from '@/lib/utils';
import { VMInstance } from '@/lib/vmUtils';

const handler = nc();

type NextAPiRequestWithBody = NextApiResponse & { body: FormValues };
handler.post(
  async (req: NextAPiRequestWithBody, res: NextApiResponse<VMInstance[]>) => {
    const { serverName, region, machineName } = req.body;
    const newInstance: VMInstance = {
      instanceId: uuidv4(),
      serverName,
      computerName: machineName,
      publicIpAddress: generateIpAddress(),
      status: 'creating',
      region,
      adminUsername: 'admin',
      size: 'Standard_D2s_v3',
      resourceGroupName: 'rg',
    };
    // validate the password
    // get all instances from
    res.json(await addInstance(newInstance));
  },
);

export default handler;
