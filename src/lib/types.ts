import {
  availableRegions,
  groupByOptionsNames,
  groupByOptionsValues,
  powerStateNames,
  powerStateValues,
  sortOptionsNames,
  sortOptionsValues,
  sortOrderNames,
  sortOrderValues,
} from '@/lib/constants';

export type PowerStateValue = (typeof powerStateValues)[number];
export type VmPowerState = {
  name: (typeof powerStateNames)[number];
  iconColor: string;
  value: (typeof powerStateValues)[number];
};
export type SortValue = (typeof sortOptionsValues)[number];
export type SortOption = {
  // noinspection TypeScriptUnresolvedVariable
  name: (typeof sortOptionsNames)[number];
  value: (typeof sortOptionsValues)[number];
};
export type SortOrderValue = (typeof sortOrderValues)[number];
export type SortOrderOption = {
  name: (typeof sortOrderNames)[number];
  value: (typeof sortOrderValues)[number];
};
export type Region = (typeof availableRegions)[number];
export type AvailableRegions = {
  regions: Region[];
  count: number;
};
export type GroupByValue = (typeof groupByOptionsValues)[number];
export type GroupByOption = {
  // noinspection TypeScriptUnresolvedVariable
  name: (typeof groupByOptionsNames)[number];
  value: (typeof groupByOptionsValues)[number];
};

export type VMInstance = {
  instanceId: string;
  serverName: string;
  computerName: string;
  resourceGroupName: string;
  size: string;
  adminUsername: string;
  publicIpAddress: string;
  status: PowerStateValue;
  region: Region;
  isFavorite?: boolean;
};

export type AppAuthRegisterUser = {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
};
export type AppAuthSignInUser = Omit<
  AppAuthRegisterUser,
  'lastname' | 'firstname'
>;
export type AppAuthAction = 'register' | 'signin';
export type AppAuthorize = Partial<
  Omit<AppAuthRegisterUser, 'email' | 'password'>
> &
  Pick<AppAuthRegisterUser, 'email' | 'password'> & { action: AppAuthAction };

export type AppUser = Omit<AppAuthRegisterUser, 'password'> & {
  id: string;
  emailVerified?: false;
};
export type AppUserWithEmailVerification = Omit<AppUser, 'emailVerified'> & {
  emailVerified: Date | string | null;
};
