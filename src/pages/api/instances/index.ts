/* eslint-disable no-console */
import { readFile } from 'fs/promises';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import * as path from 'path';

import { VmShortDetails } from '@/lib/vmUtils';

let instances: VmShortDetails[] = [];

const handler = nc();

async function getInstances() {
  // read instances from json file having the Type VmShortDetails[]
  // and return the instances
  console.log('reading instances from file...');
  try {
    const currentDir = path.join(
      process.cwd(),
      'src',
      'pages',
      'api',
      'instances',
    );
    const jsonFile = path.join(currentDir, 'instances.json');
    const json = await readFile(jsonFile, 'utf8');
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
