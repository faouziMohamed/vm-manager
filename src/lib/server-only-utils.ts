import { readFile, stat, writeFile } from 'fs/promises';
import path from 'path';

import { sortData } from '@/lib/utils';
import { VmShortDetails } from '@/lib/vmUtils';

export async function checkFileExists(fileName: string): Promise<boolean> {
  try {
    await stat(fileName);
    return true;
  } catch (error) {
    return false;
  }
}

const jsonInstancesDb = path.join(process.cwd(), 'instances.json');
const instances: VmShortDetails[] = [];

export async function getInstances() {
  console.log('jsonInstancesDb', jsonInstancesDb);
  // read instances from json file having the Type VmShortDetails[]
  // and return the instances
  console.log('reading instances from file...');
  try {
    if (process.env.NODE_ENV !== 'development') {
      return instances;
    }
    // if file does not exist, create it
    if (!(await checkFileExists(jsonInstancesDb))) {
      await writeFile(jsonInstancesDb, JSON.stringify([]));
      return [];
    }
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

export async function addInstance(newInstance: VmShortDetails) {
  // add a new instance to the json file
  // and return the instances
  console.log('adding instance to file...');
  try {
    if (process.env.NODE_ENV !== 'development') {
      instances.push(newInstance);
      return instances;
    }
    const allInstances = await getInstances();
    allInstances.push(newInstance);
    const sortedInstances = allInstances.sort((a, b) =>
      sortData('createdAt', a, b, 'desc'),
    );

    // const instances = (await getInstances())
    await writeFile(jsonInstancesDb, JSON.stringify(sortedInstances));
    return sortedInstances;
  } catch (err) {
    const error = err as Error;
    console.error('error adding instance to file', error.cause, error.message);
    return [];
  }
}
