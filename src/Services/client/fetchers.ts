import { AvailableRegions, ErrorResponse } from '@/lib/types';

import { CreateVmResult } from '@/Services/server/azureService/azure.types';

export async function getRegions() {
  const res = await fetch('/api/v1/regions');
  return (await res.json()) as AvailableRegions;
}

export async function getMultipleVmInstances() {
  const res = await fetch('/api/v1/instances');
  return (await res.json()) as CreateVmResult[];
}

export async function getVmInstance(vmId: string) {
  const response = await fetch(`/api/v1/instances/${vmId}`);
  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw new Error(error.message);
  }
  return (await response.json()) as CreateVmResult;
}
