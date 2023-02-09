/* eslint-disable no-console */
import { readFile, writeFile } from 'fs/promises';
import { NextApiResponse } from 'next';
import nc from 'next-connect';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

import { FormValues, generateIpAddress, sortData } from '@/lib/utils';
import { VmShortDetails } from '@/lib/vmUtils';

const handler = nc();

const currentDir = path.join(process.cwd(), 'src', 'pages', 'api', 'instances');
const jsonInstancesDb = path.join(currentDir, 'instances.json');

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

async function addInstance(newInstance: VmShortDetails) {
  // add a new instance to the json file
  // and return the instances
  console.log('adding instance to file...');
  try {
    const instances = (await getInstances()).sort((a, b) =>
      sortData('createdAt', a, b, 'desc'),
    );
    instances.push(newInstance);
    await writeFile(jsonInstancesDb, JSON.stringify(instances));
    return instances;
  } catch (err) {
    const error = err as Error;
    console.error('error adding instance to file', error.cause, error.message);
    return [];
  }
}

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
