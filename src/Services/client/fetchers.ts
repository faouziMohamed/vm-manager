import {
  ALL_INSTANCES_ROUTE,
  getInstanceRoute,
  REGIONS_ROUTE,
} from '@/lib/api-route';
import { AvailableRegions, ErrorResponse } from '@/lib/types';

import { CreateVmResult } from '@/Services/server/azureService/azure.types';

export async function getRegions() {
  const res = await fetch(REGIONS_ROUTE);
  return (await res.json()) as AvailableRegions;
}

export async function getMultipleVmInstances() {
  const res = await fetch(ALL_INSTANCES_ROUTE);
  return (await res.json()) as CreateVmResult[];
}

export async function getVmInstance(vmId: string) {
  const response = await fetch(getInstanceRoute(vmId));
  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw new Error(error.message);
  }
  return (await response.json()) as CreateVmResult;
}
