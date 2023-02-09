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

export async function getInstances() {
  // read instances from json file having the Type VmShortDetails[]
  // and return the instances
  console.log('reading instances from file...');
  try {
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
    const instances = await getInstances();
    instances.push(newInstance);
    const sortedInstances = instances.sort((a, b) =>
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
