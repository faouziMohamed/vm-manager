import { ComputeManagementClient, VirtualMachine } from '@azure/arm-compute';
import { NetworkManagementClient, PublicIPAddress } from '@azure/arm-network';
import { ResourceManagementClient } from '@azure/arm-resources';
import { DefaultAzureCredential } from '@azure/identity';
import { v4 as uuid } from 'uuid';

import { PowerStateValue } from '@/lib/types';

import {
  offer,
  publisher,
  size,
  sku,
  subscriptionId,
} from '@/Services/server/azureService/azure.constants';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

const credentials = new DefaultAzureCredential();

const networkClient = new NetworkManagementClient(credentials, subscriptionId);
const computeClient = new ComputeManagementClient(credentials, subscriptionId);
const resourceClient = new ResourceManagementClient(
  credentials,
  subscriptionId,
);

export function getAzureClients() {
  return { networkClient, computeClient, resourceClient };
}

export function createResourceId(vmDetails: CreateVmResult): string;
export function createResourceId(
  resourceGroupName: string,
  resourceType: string,
  resourceName: string,
): string;
export function createResourceId(...params: unknown[]): string {
  if (
    params.length === 1 &&
    typeof params[0] === 'object' &&
    params[0] !== null
  ) {
    const vmInstanceDetails = params[0] as CreateVmResult;
    return createResourceId(
      vmInstanceDetails.resourceGroupName,
      vmInstanceDetails.resourceType,
      vmInstanceDetails.computerName,
    );
  }
  const [resourceGroupName, resourceType, resourceName] = params as [
    string,
    string,
    string,
  ];
  return `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroupName}/providers/${resourceType}/${resourceName}`;
}

export function createVmParameter(
  location: string,
  virtualMachineName: string,
  adminUsername: string,
  adminPassword: string,
  resourceGroupName: string,
  nicName: string,
) {
  const rgName = resourceGroupName;
  const niResType = 'Microsoft.Network/networkInterfaces';
  const networkInterfaceId = createResourceId(rgName, niResType, nicName);
  const vmParameters: VirtualMachine = {
    location,
    hardwareProfile: { vmSize: size },
    storageProfile: {
      imageReference: { publisher, offer, sku, version: 'latest' },
      osDisk: {
        createOption: 'FromImage',
        caching: 'ReadWrite',
        managedDisk: { storageAccountType: 'Standard_LRS' },
        name: `${virtualMachineName}-osdisk-${uuid().substring(0, 4)}`,
      },
    },
    osProfile: {
      computerName: virtualMachineName,
      adminUsername,
      adminPassword,
      windowsConfiguration: { enableAutomaticUpdates: true },
    },
    networkProfile: {
      networkInterfaces: [{ id: networkInterfaceId, primary: true }],
    },
    licenseType: 'Windows_Client',
  };
  return vmParameters;
}

export async function getVmDetails(
  vm: VirtualMachine,
  resourceGroupName: string,
  vmName: string,
  publicIpInfo: PublicIPAddress,
  pipName: string,
) {
  const powerState = (await getPowerState(resourceGroupName, vmName))!;
  const vmInstanceDetails: CreateVmResult = {
    instanceId: vm.vmId!,
    resourceGroupName,
    vmUsername: vm.osProfile!.adminUsername!,
    computerName: vmName,
    region: vm.location,
    serverName: '',
    size: {
      name: 'Standard_D2s_v3',
      vCpus: '2',
      memory: '8 GiB',
      tempStorage: '16 GiB',
    },
    os: 'Windows',
    publicIpAddress: publicIpInfo.ipAddress!,
    publicIpName: pipName,
    licenseType: vm.licenseType!,
    powerState,
    timeCreated: vm.timeCreated!,
    resourceType: vm.type || 'Microsoft.Compute/virtualMachines',
  };
  return vmInstanceDetails;
}

// virtualMachines.restart
export async function restartVm(resourceGroupName: string, vmName: string) {
  await computeClient.virtualMachines.beginRestartAndWait(
    resourceGroupName,
    vmName,
  );
  // eslint-disable-next-line no-console
  console.log('Restarted VM');
}

// virtualMachines.start
export async function startVm(resourceGroupName: string, vmName: string) {
  await computeClient.virtualMachines.beginStartAndWait(
    resourceGroupName,
    vmName,
  );
}

// virtualMachines.deallocate
export async function deallocateVm(resourceGroupName: string, vmName: string) {
  await computeClient.virtualMachines.beginDeallocateAndWait(
    resourceGroupName,
    vmName,
  );
}

// virtualMachines.delete
export async function deleteVm(resourceGroupName: string, vmName: string) {
  await computeClient.virtualMachines.beginDeleteAndWait(
    resourceGroupName,
    vmName,
  );
}

export async function getPowerState(resourceGroupName: string, vmName: string) {
  const instanceView = await computeClient.virtualMachines.instanceView(
    resourceGroupName,
    vmName,
  );
  if (!instanceView.statuses) {
    return null;
  }
  const powerState = instanceView.statuses.find((status) =>
    status.code!.startsWith('PowerState'),
  );
  const status = powerState!.code!.split('/')[1];
  if (status === 'deallocated') {
    return 'stopped';
  }
  if (status === 'deallocating') {
    return 'stopping';
  }
  return status as PowerStateValue;
}
