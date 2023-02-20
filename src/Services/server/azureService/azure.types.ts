import { PowerStateValue, Region } from '@/lib/types';

import { MANAGE_VM_ACTIONS } from '@/Services/server/azureService/azure.constants';

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
export type ManageVmAction = (typeof MANAGE_VM_ACTIONS)[number];
