/* eslint-disable no-console */
import {
  NetworkInterface,
  PublicIPAddress,
  Subnet,
  VirtualNetwork,
} from '@azure/arm-network';
import { ResourceGroup } from '@azure/arm-resources';
import { v4 as uuid } from 'uuid';

import {
  CreatingResourceError,
  ManageVmError,
  ResourceNotFoundError,
} from '@/lib/Exceptions/azure.exceptions';
import { Region } from '@/lib/types';

import { ManageVmAction } from '@/Services/server/azureService/azure.types';
import {
  createVmParameter,
  deallocateVm,
  deleteVm,
  getAzureClients,
  getPowerState,
  getVmDetails,
  restartVm,
  startVm,
} from '@/Services/server/azureService/azure.utils';

// Acquire credentials
const { networkClient, computeClient, resourceClient } = getAzureClients();

// export async function get

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
  const rgName = resourceGroupName;
  const rgParams: ResourceGroup = { location, tags: { 'keystone-vm': 'true' } };
  return resourceClient.resourceGroups.createOrUpdate(rgName, rgParams);
}

export async function createVirtualMachine(
  virtualMachineName: string,
  location: Region,
  adminUsername: string,
  adminPassword: string,
) {
  const vmName = virtualMachineName;
  const vNetName = `${vmName}-vn-${uuid().substring(0, 4)}`;
  const subnetName = `${vmName}-subnet-${uuid().substring(0, 4)}`;
  const resourceGroupName = `${vmName}-rg-${uuid().substring(0, 4)}`;
  const nicName = `${vmName}-nic-${uuid().substring(0, 4)}`;
  const pipName = `${vmName}-pip-${uuid().substring(0, 4)}`;
  try {
    const rgName = resourceGroupName;
    await createResourceGroup(rgName, location);
    await createVirtualNetwork(vNetName, location, rgName);
    const subnetInfo = await createSubnet(subnetName, rgName, vNetName);
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
    return await getVmDetails(
      vm,
      rgName,
      virtualMachineName,
      publicIpInfo,
      pipName,
    );
  } catch (error) {
    const e = error as Error;
    console.log(
      'Error while creating VM: ',
      e.message,
      'Attempting to clean up...',
    );

    try {
      await manageVirtualMachine(resourceGroupName, vmName, 'delete');
    } catch (err) {
      const err2 = err as Error;
      console.log('Error while cleaning up VM: ', err2.message);
    }
    throw new CreatingResourceError(
      "Couldn't create the Virtual Machine with it associated resources",
    );
  }
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
  try {
    const vm = await computeClient.virtualMachines.get(
      resourceGroupName,
      vmName,
    );
    const pip = await getPublicIpAddress(resourceGroupName, pipName);
    const details = await getVmDetails(
      vm,
      resourceGroupName,
      vmName,
      pip,
      pipName,
    );
    details.serverName = serverName;
    return details;
  } catch (error) {
    const e = error as Error;
    console.log('Error while getting VM: ', e.message);
    throw new ResourceNotFoundError(
      "Couldn't get the Virtual Machine, it may have been deleted or doesn't exist",
    );
  }
}

export async function manageVirtualMachine(
  resourceGroupName: string,
  vmName: string,
  action: ManageVmAction,
) {
  const mapping: {
    [key in ManageVmAction]: (rgName: string, vmName: string) => Promise<void>;
  } = {
    start: startVm,
    stop: deallocateVm,
    restart: restartVm,
    delete: deleteVm,
  };
  if (!(action in mapping)) {
    const message = `Invalid action '${action as string}' provided`;
    console.log(message);
    throw new ManageVmError(message);
  }
  try {
    await mapping[action](resourceGroupName, vmName);
  } catch (error) {
    const e = error as Error;
    console.log('Error while managing VM: ', e.message);
    throw new ManageVmError(
      "Couldn't manage the Virtual Machine, it may have been deleted or doesn't exist",
    );
  }
}

export async function getVmPowerState(
  resourceGroupName: string,
  vmName: string,
) {
  return getPowerState(resourceGroupName, vmName);
}
