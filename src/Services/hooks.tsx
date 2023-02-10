import useSWR, { mutate } from 'swr';

import { AvailableRegions, VMInstance } from '@/lib/types';
import { FormValues } from '@/lib/utils';

import {
  getMultipleVmInstances,
  getRegions,
  getVmInstance,
} from '@/Services/fetchers';

const fetchInstancesKey = '/api/instances';
export function useMultipleVmInstances() {
  const { data, error, isLoading } = useSWR<VMInstance[], Error>(
    fetchInstancesKey,
    getMultipleVmInstances,
  );
  return { data, error, isLoading };
}

export function refreshVmInstances() {
  return mutate(fetchInstancesKey, getMultipleVmInstances);
}

export function useAvailableRegions() {
  const { data, error, isLoading } = useSWR<AvailableRegions, Error>(
    '/api/regions',
    getRegions,
  );
  return { data, error, isLoading };
}

async function addNewVmInstance(props: { url: string; body: FormValues }) {
  const { url, body } = props;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Something went wrong, please try again later.');
  }
  return (await response.json()) as VMInstance[];
}

export async function saveNewVm(body: FormValues) {
  const url = '/api/instances/new';
  const instances = await addNewVmInstance({ url, body });
  await mutate(fetchInstancesKey, instances, false);
}

export function useVmInstance(vmId: string | undefined) {
  const fetcher = () => getVmInstance(vmId!);
  return useSWR<VMInstance, Error>(
    vmId ? `/api/instances/${vmId}` : null,
    fetcher,
    { refreshInterval: 10000, refreshWhenHidden: false },
  );
}
