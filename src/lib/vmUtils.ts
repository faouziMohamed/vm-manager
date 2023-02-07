export const powerStateNames = [
  'All',
  'Running',
  'Restarting',
  'Stopped',
  'Starting',
  'Creating',
] as const;
export const powerStateValues = [
  'all',
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
  all: '#004D5E',
  running: '#6FABE6',
  restarting: '#B87A02',
  stopped: '#B60057',
  starting: '#B2B600',
  creating: '#CDBFD9',
};
export const powerStates: VmPowerState[] = [
  { name: 'All', iconColor: powerStateColors.all, value: 'all' },
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
