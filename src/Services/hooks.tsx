import useSWR, { mutate } from 'swr';

import { FormValues } from '@/lib/utils';
import { AvailableRegions, VmShortDetails } from '@/lib/vmUtils';

import { getInstances, getRegions } from '@/Services/fetchers';

const fetchInstancesKey = '/api/instances';
export function useVmShortDetails() {
  const { data, error, isLoading } = useSWR<VmShortDetails[], Error>(
    fetchInstancesKey,
    getInstances,
  );
  return { data, error, isLoading };
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
  return (await response.json()) as VmShortDetails[];
}

export async function saveNewVm(body: FormValues) {
  const url = '/api/instances/new';
  const instances = await addNewVmInstance({ url, body });
  await mutate(fetchInstancesKey, instances, false);
}
