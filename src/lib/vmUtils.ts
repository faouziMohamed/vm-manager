import {
  GroupByOption,
  PowerStateValue,
  SortOption,
  VmPowerState,
} from '@/lib/types';

export const powerStateColors: Record<PowerStateValue, string> = {
  default: '#0c323b',
  running: '#6FABE6',
  starting: '#B2B600',
  stopping: '#CDBFD9',
  stopped: '#B60057',
  unknown: '#B87A02',
};
export const powerStates: VmPowerState[] = [
  { name: 'Filter', iconColor: powerStateColors.default, value: 'default' },
  { name: 'Running', iconColor: powerStateColors.running, value: 'running' },
  {
    name: 'Starting',
    iconColor: powerStateColors.starting,
    value: 'starting',
  },
  { name: 'Stopping', iconColor: powerStateColors.stopping, value: 'stopping' },
  { name: 'Stopped', iconColor: powerStateColors.stopped, value: 'stopped' },
  { name: 'Unknown', iconColor: powerStateColors.unknown, value: 'unknown' },
];
export const sortOptions: SortOption[] = [
  { name: 'Sort', value: 'default' },
  { name: 'Name', value: 'name' },
  { name: 'Ip Address', value: 'ipAddress' },
];

export const groupByOptions: GroupByOption[] = [
  { name: 'Group By', value: 'default' },
  { name: 'Power State', value: 'powerState' },
  { name: 'Region', value: 'region' },
];
