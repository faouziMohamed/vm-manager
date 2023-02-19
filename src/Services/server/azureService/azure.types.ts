import { PowerStateValue, Region } from '@/lib/types';

export type CreateVmResult = {
  instanceId: string;
  computerName: string;
  serverName: string;
  resourceGroupName: string;
  os: string;
  powerState: PowerStateValue;
  region: Region;
  size: {
    name: string; // VM size name
    vCpus: string; // Number of vCPUs
    memory: string; // RAM of the VM
    tempStorage: string; // Temp disk storage of the VM
  };
  vmUsername: string;
  publicIpAddress: string;
  licenseType: string;
  timeCreated: Date | string;
  resourceType: string;
  publicIpName: string;
  isFavorite?: boolean;
};
