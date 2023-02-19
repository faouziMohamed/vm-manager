/* eslint-disable no-console */
import {
  NetworkInterface,
  PublicIPAddress,
  Subnet,
  VirtualNetwork,
} from '@azure/arm-network';
import { ResourceGroup } from '@azure/arm-resources';
import { v4 as uuid } from 'uuid';

import { ManageVmError } from '@/lib/Exceptions/azure.exceptions';
import { Region } from '@/lib/types';

import {
  createVmParameter,
  deallocateVm,
  deleteVm,
  getAzureClients,
  getVmDetails,
  restartVm,
  startVm,
} from '@/Services/server/azureService/azure.utils';

// Acquire credentials
const { networkClient, computeClient, resourceClient } = getAzureClients();

export async function getVmRuntimeState(
  resourceGroupName: string,
  vmName: string,
) {
  return computeClient.virtualMachines.instanceView(resourceGroupName, vmName);
}

export async function createVirtualNetwork(
  virtualNetworkName: string,
  location: Region,
  resourceGroupName: string,
) {
  console.log(`Creating virtual network ${virtualNetworkName}...`);
  const virtualNetworkParameters: VirtualNetwork = {
    location,
    addressSpace: { addressPrefixes: ['10.0.0.0/16'] },
  };
  return networkClient.virtualNetworks.beginCreateOrUpdateAndWait(
    resourceGroupName,
    virtualNetworkName,
    virtualNetworkParameters,
  );
}

export async function createSubnet(
  name: string,
  resourceGroupName: string,
  virtualNetworkName: string,
) {
  console.log(`Creating subnet ${name}...`);
  const subnetParameters: Subnet = {
    addressPrefix: '10.0.0.0/24',
  };

  return networkClient.subnets.beginCreateOrUpdateAndWait(
    resourceGroupName,
    virtualNetworkName,
    name,
    subnetParameters,
  );
}

export async function createPublicIpAddress(
  resourceGroupName: string,
  publicIpAddressName: string,
  location: string,
) {
  console.log(`Creating public IP address ${publicIpAddressName}...`);
  const publicIpAddressParameters: PublicIPAddress = {
    location,
    publicIPAllocationMethod: 'Static',
  };
  return networkClient.publicIPAddresses.beginCreateOrUpdateAndWait(
    resourceGroupName,
    publicIpAddressName,
    publicIpAddressParameters,
  );
}

export async function createNetworkInterface(
  resourceGroupName: string,
  networkInterfaceName: string,
  publicIpInfo: PublicIPAddress,
  subnetInfo: Subnet,
  location: string,
) {
  console.log(`Creating network interface ${networkInterfaceName}...`);
  const networkInterfaceParameters: NetworkInterface = {
    location,
    ipConfigurations: [
      {
        name: `ipconfig-${uuid().substring(0, 4)}`,
        privateIPAllocationMethod: 'Dynamic',
        subnet: subnetInfo,
        publicIPAddress: publicIpInfo,
      },
    ],
  };
  return networkClient.networkInterfaces.beginCreateOrUpdateAndWait(
    resourceGroupName,
    networkInterfaceName,
    networkInterfaceParameters,
  );
}

export async function createResourceGroup(
  resourceGroupName: string,
  location: Region,
) {
  console.log(`Creating resource group ${resourceGroupName}...`);
  const resourceGroupParameters: ResourceGroup = {
    location,
    tags: { 'keystone-vm': 'true' },
  };
  return resourceClient.resourceGroups.createOrUpdate(
    resourceGroupName,
    resourceGroupParameters,
  );
}

export async function createVirtualMachine(
  virtualMachineName: string,
  location: Region,
  adminUsername: string,
  adminPassword: string,
) {
  const vmName = virtualMachineName;
  const vnName = `${vmName}-vn-${uuid().substring(0, 4)}`;
  const subnetName = `${vmName}-subnet-${uuid().substring(0, 4)}`;
  const resourceGroupName = `${vmName}-rg-${uuid().substring(0, 4)}`;
  const nicName = `${vmName}-nic-${uuid().substring(0, 4)}`;
  const pipName = `${vmName}-pip-${uuid().substring(0, 4)}`;

  const rgName = resourceGroupName;
  await createResourceGroup(rgName, location);
  await createVirtualNetwork(vnName, location, rgName);
  const subnetInfo = await createSubnet(subnetName, rgName, vnName);
  const publicIpInfo = await createPublicIpAddress(rgName, pipName, location);
  const netInterfaceParams: Parameters<typeof createNetworkInterface> = [
    rgName,
    nicName,
    publicIpInfo,
    subnetInfo,
    location,
  ];
  await createNetworkInterface(...netInterfaceParams);
  const vmParameters = createVmParameter(
    location,
    vmName,
    adminUsername,
    adminPassword,
    rgName,
    nicName,
  );
  console.log(`Creating Virtual Machine ${vmName}...`);
  const vm = await computeClient.virtualMachines.beginCreateOrUpdateAndWait(
    rgName,
    virtualMachineName,
    vmParameters,
  );
  console.log('Virtual Machine created\n');
  return getVmDetails(vm, rgName, virtualMachineName, publicIpInfo, pipName);
}

export async function getPublicIpAddress(
  resourceGroupName: string,
  pipName: string,
) {
  return networkClient.publicIPAddresses.get(resourceGroupName, pipName);
}

export async function getVirtualMachine(
  resourceGroupName: string,
  vmName: string,
  pipName: string,
  serverName: string,
) {
  const vm = await computeClient.virtualMachines.get(resourceGroupName, vmName);
  const pip = await getPublicIpAddress(resourceGroupName, pipName);
  const details = getVmDetails(vm, resourceGroupName, vmName, pip, pipName);
  details.serverName = serverName;
  return details;
}

export type ManageVmAction = 'start' | 'stop' | 'restart' | 'delete';

export async function manageVirtualMachine(
  resourceGroupName: string,
  vmName: string,
  action: ManageVmAction,
) {
  console.log(`\n${action}ing virtual machine ${vmName}...`);
  await computeClient.virtualMachines.beginStartAndWait(
    resourceGroupName,
    vmName,
  );
  switch (action) {
    case 'start': {
      await startVm(resourceGroupName, vmName);
      break;
    }
    case 'stop': {
      await deallocateVm(resourceGroupName, vmName);
      break;
    }
    case 'restart': {
      await restartVm(resourceGroupName, vmName);
      break;
    }
    case 'delete': {
      await deleteVm(resourceGroupName, vmName);
      break;
    }
    default: {
      throw new ManageVmError(`Invalid action '${action as string}' provided`);
    }
  }
}
