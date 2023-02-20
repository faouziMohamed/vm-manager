export const availableRegions = [
  'eastus',
  'eastus2',
  'southcentralus',
  'westus2',
  'westeurope',
  'northeurope',
  'japaneast',
  'southeastasia',
  'australiaeast',
  'centralus',
  'northcentralus',
  'canadacentral',
  'uksouth',
  'westus',
  'koreacentral',
  'francecentral',
  'australiasoutheast',
  'southafricanorth',
  'brazilsouth',
  'norwayeast',
  'switzerlandnorth',
  'norwaywest',
];

export const powerStateNames = [
  'Filter',
  'Running',
  'Starting',
  'Stopping',
  'Stopped',
  'Unknown',
] as const;
export const powerStateValues = [
  'default',
  'running',
  'starting',
  'stopping',
  'stopped',
  'unknown',
] as const;
export const sortOptionsNames = ['Sort', 'Name', 'Ip Address'] as const;
export const sortOptionsValues = ['default', 'name', 'ipAddress'] as const;
export const sortOrderNames = ['Ascending', 'Descending'] as const;
export const sortOrderValues = ['asc', 'desc'] as const;
export const groupByOptionsNames = [
  'Group By',
  'Region',
  'Power State',
] as const;
export const groupByOptionsValues = [
  'default',
  'region',
  'powerState',
] as const;
