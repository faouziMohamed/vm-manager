import { AvailableRegions, VMInstance } from '@/lib/types';

import { ErrorResponse } from '@/pages/api/instances/[instanceId]';

export async function getRegions() {
  const res = await fetch('/api/regions');
  return (await res.json()) as AvailableRegions;
}

export async function getMultipleVmInstances() {
  const res = await fetch('/api/instances');
  return (await res.json()) as VMInstance[];
}

export async function getVmInstance(vmId: string) {
  const response = await fetch(`/api/instances/${vmId}`);
  if (!response.ok) {
    const error = (await response.json()) as ErrorResponse;
    throw new Error(error.message);
  }
  return (await response.json()) as VMInstance;
}
