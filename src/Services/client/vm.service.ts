import useSWR, { mutate } from 'swr';

import {
  ALL_INSTANCES_ROUTE,
  getInstanceActionRoute,
  getInstanceRoute,
  NEW_INSTANCE_ROUTE,
  REGIONS_ROUTE,
} from '@/lib/api-route';
import { AvailableRegions, NewVmValues } from '@/lib/types';

import {
  getMultipleVmInstances,
  getRegions,
  getVmInstance,
} from '@/Services/client/fetchers';
import {
  CreateVmResult,
  ManageVmAction,
} from '@/Services/server/azureService/azure.types';

const fetchInstancesKey = ALL_INSTANCES_ROUTE;

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
  return mutate(getInstanceRoute(vmId), getVmInstance(vmId));
}

export function mutateVmInstance(
  vmId: string,
  data: CreateVmResult | undefined = undefined,
) {
  return mutate(getInstanceRoute(vmId), data);
}

export function useAvailableRegions() {
  const { data, error, isLoading } = useSWR<AvailableRegions, Error>(
    REGIONS_ROUTE,
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
  const url = NEW_INSTANCE_ROUTE;
  const instances = await addNewVmInstance({ url, body });
  await mutate(fetchInstancesKey, instances, false);
}

export function useVmInstance(vmId: string | undefined) {
  const fetcher = () => getVmInstance(vmId!);
  return useSWR<CreateVmResult, Error>(
    vmId ? getInstanceRoute(vmId) : null,
    fetcher,
    { refreshInterval: 10000, refreshWhenHidden: false },
  );
}

export async function manageVmInstance(
  instance: CreateVmResult,
  action: ManageVmAction,
) {
  const url = getInstanceActionRoute(instance.instanceId, action);
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
  const url = getInstanceActionRoute(vmId, 'favorite');
  const response = await fetch(url, { method: 'PUT' });

  if (!response.ok) {
    throw new Error('Something went wrong, please try again later.');
  }
  void mutateVmInstance(vmId, instance);
  return instance;
}
