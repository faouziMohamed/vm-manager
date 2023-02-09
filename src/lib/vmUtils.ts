export const powerStateNames = [
  'Filter',
  'Running',
  'Restarting',
  'Stopped',
  'Starting',
  'Creating',
] as const;
export const powerStateValues = [
  'default',
  'running',
  'restarting',
  'stopped',
  'starting',
  'creating',
] as const;
export type PowerStateValue = (typeof powerStateValues)[number];
export type VmPowerState = {
  name: (typeof powerStateNames)[number];
  iconColor: string;
  value: (typeof powerStateValues)[number];
};
export const powerStateColors: Record<PowerStateValue, string> = {
  default: '#004D5E',
  running: '#6FABE6',
  restarting: '#B87A02',
  stopped: '#B60057',
  starting: '#B2B600',
  creating: '#CDBFD9',
};
export const powerStates: VmPowerState[] = [
  { name: 'Filter', iconColor: powerStateColors.default, value: 'default' },
  { name: 'Running', iconColor: powerStateColors.running, value: 'running' },
  {
    name: 'Restarting',
    iconColor: powerStateColors.restarting,
    value: 'restarting',
  },
  { name: 'Stopped', iconColor: powerStateColors.stopped, value: 'stopped' },
  {
    name: 'Starting',
    iconColor: powerStateColors.starting,
    value: 'starting',
  },
  {
    name: 'Creating',
    iconColor: powerStateColors.creating,
    value: 'creating',
  },
];
export const sortOptionsNames = [
  'Sort',
  'Name',
  'Creation Date',
  'Ip Address',
] as const;
export const sortOptionsValues = [
  'default',
  'name',
  'createdAt',
  'ipAddress',
] as const;
export type SortValue = (typeof sortOptionsValues)[number];
export type SortOption = {
  // noinspection TypeScriptUnresolvedVariable
  name: (typeof sortOptionsNames)[number];
  value: (typeof sortOptionsValues)[number];
};
export const sortOptions: SortOption[] = [
  { name: 'Sort', value: 'default' },
  { name: 'Name', value: 'name' },
  { name: 'Creation Date', value: 'createdAt' },
  { name: 'Ip Address', value: 'ipAddress' },
];

export const sortOrderNames = ['Ascending', 'Descending'] as const;
export const sortOrderValues = ['asc', 'desc'] as const;
export type SortOrderValue = (typeof sortOrderValues)[number];
export type SortOrderOption = {
  name: (typeof sortOrderNames)[number];
  value: (typeof sortOrderValues)[number];
};

export const availableRegions = [
  'chinaeast2',
  'uaenorth',
  'usgovvirginia',
  'australiacentral2',
  'canadaeast',
  'northcentralus',
  'westindia',
  'chinanorth',
  'koreacentral',
  'francecentral',
  'germanynorth',
  'germanycentral',
  'australiacentral',
  'usgoviowa',
  'japaneast',
  'southcentralus',
  'usdodcentral',
  'eastus',
  'uaecentral',
  'australiasoutheast',
  'centralus',
  'centralindia',
  'westcentralus',
  'germanywestcentral',
  'usgovarizona',
  'eastus2',
  'usdodeast',
  'southeastasia',
  'francesouth',
  'koreasouth',
  'switzerlandnorth',
  'norwayeast',
  'southafricanorth',
  'ukwest',
  'switzerlandwest',
  'swedencentral',
  'chinaeast',
  'japanwest',
  'brazilsouth',
  'westus3',
  'northeurope',
  'australiaeast',
  'southindia',
  'westus',
  'norwaywest',
  'canadacentral',
  'westeurope',
  'southafricawest',
  'eastasia',
  'germanynortheast',
  'chinanorth2',
  'westus2',
  'usgovtexas',
  'uksouth',
] as const;
export type Region = (typeof availableRegions)[number];
export type AvailableRegions = {
  regions: Region[];
  count: number;
};
export const groupByOptionsNames = ['Group By', 'Region', 'Status'] as const;
export const groupByOptionsValues = ['default', 'region', 'status'] as const;
export type GroupByValue = (typeof groupByOptionsValues)[number];
export type GroupByOption = {
  // noinspection TypeScriptUnresolvedVariable
  name: (typeof groupByOptionsNames)[number];
  value: (typeof groupByOptionsValues)[number];
};
export const groupByOptions: GroupByOption[] = [
  { name: 'Group By', value: 'default' },
  { name: 'Status', value: 'status' },
  { name: 'Region', value: 'region' },
];
export type VmShortDetails = {
  id: string;
  name: string;
  region: string;
  status: PowerStateValue;
  ipAddress: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};
