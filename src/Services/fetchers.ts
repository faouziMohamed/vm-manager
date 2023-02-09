import { AvailableRegions, VmShortDetails } from '@/lib/vmUtils';

export async function getRegions() {
  const res = await fetch('/api/regions');
  return (await res.json()) as AvailableRegions;
}

export async function getInstances() {
  const res = await fetch('/api/instances');
  return (await res.json()) as VmShortDetails[];
}
