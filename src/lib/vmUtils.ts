import {
  GroupByOption,
  PowerStateValue,
  SortOption,
  VmPowerState,
} from '@/lib/types';

export const powerStateColors: Record<PowerStateValue, string> = {
  default: '#0c323b',
  running: '#6FABE6',
  restarting: '#B87A02',
  stopped: '#B60057',
  starting: '#B2B600',
  creating: '#CDBFD9',
  Succeeded: '#6FABE6',
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
export const sortOptions: SortOption[] = [
  { name: 'Sort', value: 'default' },
  { name: 'Name', value: 'name' },
  { name: 'Ip Address', value: 'ipAddress' },
];

export const groupByOptions: GroupByOption[] = [
  { name: 'Group By', value: 'default' },
  { name: 'Status', value: 'powerState' },
  { name: 'Region', value: 'region' },
];
