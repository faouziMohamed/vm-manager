/* eslint-disable no-console */
import { readFile } from 'fs/promises';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import * as path from 'path';

import { VmShortDetails } from '@/lib/vmUtils';

let instances: VmShortDetails[] = [];

const handler = nc();
const jsonInstancesDb = path.join(process.cwd(), 'instances.json');

async function getInstances() {
  // read instances from json file having the Type VmShortDetails[]
  // and return the instances
  console.log('reading instances from file...');
  try {
    const json = await readFile(jsonInstancesDb, 'utf8');
    return JSON.parse(json) as VmShortDetails[];
  } catch (err) {
    const error = err as Error;
    console.error(
      'error reading instances from file',
      error.cause,
      error.message,
    );
    return [];
  }
}

handler.get(async (req, res: NextApiResponse<VmShortDetails[]>) => {
  // get all instances from
  instances = await getInstances();
  res.json(instances);
});

export default handler;
