import useSWR, { mutate } from 'swr';

import { AvailableRegions } from '@/lib/types';
import { NewVmValues } from '@/lib/utils';

import {
  getMultipleVmInstances,
  getRegions,
  getVmInstance,
} from '@/Services/client/fetchers';
import {
  CreateVmResult,
  ManageVmAction,
} from '@/Services/server/azureService/azure.types';

const fetchInstancesKey = '/api/v1/instances';
export function useCurrentUserVmInstances() {
  const { data, error, isLoading } = useSWR<CreateVmResult[], Error>(
    fetchInstancesKey,
    getMultipleVmInstances,
  );
  return { data, error, isLoading };
}

export function refreshVmInstances() {
  return mutate(fetchInstancesKey, getMultipleVmInstances);
}

export function refreshVmInstance(vmId: string) {
  return mutate(`/api/v1/instances/${vmId}`, getVmInstance(vmId));
}

export function mutateVmInstance(
  vmId: string,
  data: CreateVmResult | undefined = undefined,
) {
  return mutate(`/api/v1/instances/${vmId}`, data);
}

export function useAvailableRegions() {
  const { data, error, isLoading } = useSWR<AvailableRegions, Error>(
    '/api/v1/regions',
    getRegions,
  );
  return { data, error, isLoading };
}

async function addNewVmInstance(props: { url: string; body: NewVmValues }) {
  const { url, body } = props;
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Something went wrong, please try again later.');
  }
  return (await response.json()) as CreateVmResult[];
}

export async function saveNewVm(body: NewVmValues) {
  const url = '/api/v1/instances/new';
  const instances = await addNewVmInstance({ url, body });
  await mutate(fetchInstancesKey, instances, false);
}

export function useVmInstance(vmId: string | undefined) {
  const fetcher = () => getVmInstance(vmId!);
  return useSWR<CreateVmResult, Error>(
    vmId ? `/api/v1/instances/${vmId}` : null,
    fetcher,
    { refreshInterval: 10000, refreshWhenHidden: false },
  );
}

export async function manageVmInstance(
  instance: CreateVmResult,
  action: ManageVmAction,
) {
  const url = `/api/v1/instances/${instance.instanceId}/${action}`;
  const response = await fetch(url, { method: 'PUT' });

  if (!response.ok) {
    throw new Error('Something went wrong, please try again later.');
  }
  void mutateVmInstance(instance.instanceId, instance);
  return instance;
}

export async function updateInstanceFavoriteStatus(
  vmId: string,
  instance: CreateVmResult,
) {
  const url = `/api/v1/instances/${vmId}/favorite`;
  const response = await fetch(url, { method: 'PUT' });

  if (!response.ok) {
    throw new Error('Something went wrong, please try again later.');
  }
  void mutateVmInstance(vmId, instance);
  return instance;
}
