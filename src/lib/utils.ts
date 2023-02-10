import { NextRouter } from 'next/router';

import {
  GroupByOption,
  GroupByValue,
  PowerStateValue,
  Region,
  SortOption,
  SortOrderOption,
  SortOrderValue,
  SortValue,
  VMInstance,
  VmPowerState,
} from '@/lib/vmUtils';

export function adjustColor(hex: string, percent: number): string {
  const regex = /^#[0-9A-Fa-f]{6}$/;
  if (!regex.test(hex)) {
    throw new Error('Invalid hexadecimal color string.');
  }

  const hasHash = hex[0] === '#';
  let hexWithoutHash = hex;
  if (hasHash) {
    hexWithoutHash = hex.substring(1);
  }

  const red = parseInt(hexWithoutHash.substring(0, 2), 16);
  const green = parseInt(hexWithoutHash.substring(2, 4), 16);
  const blue = parseInt(hexWithoutHash.substring(4, 6), 16);

  const newRed = adjustComponent(red, percent);
  const newGreen = adjustComponent(green, percent);
  const newBlue = adjustComponent(blue, percent);

  const newHexWithoutHash =
    componentToHex(newRed) + componentToHex(newGreen) + componentToHex(newBlue);
  return (hasHash ? '#' : '') + newHexWithoutHash;
}

function adjustComponent(colorComponent: number, percent: number): number {
  const adjustedColor = colorComponent + Math.round((255 * percent) / 100);
  return Math.max(0, Math.min(255, adjustedColor));
}

function componentToHex(colorComponent: number): string {
  let hex = colorComponent.toString(16).toUpperCase();
  if (hex.length === 1) {
    hex = `0${hex}`;
  }
  return hex;
}

export function updateQueryParams(
  router: NextRouter,
  value:
    | VmPowerState
    | GroupByOption
    | SortOption
    | SortOrderOption
    | { value: 'default' },
  queryParam: string,
) {
  let query = { ...router.query };
  if (value.value === 'default' || value.value === 'asc') {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { [queryParam]: _, ...rest } = query;
    query = rest;
  } else {
    query = { ...query, [queryParam]: value.value };
  }

  void router.replace({ pathname: router.pathname, query }, undefined, {
    shallow: true,
  });
  return query;
}

export type NextRouterWithQueries = NextRouter & {
  query: {
    filter?: PowerStateValue;
    group_by?: GroupByValue;
    sort: SortValue;
    sort_order?: SortOrderValue;
  };
};

function compareNames(a: string, b: string, order: SortOrderValue = 'asc') {
  return order === 'asc' ? a.localeCompare(b) : b.localeCompare(a);
}

function compareIpAddresses(
  a: string,
  b: string,
  order: SortOrderValue = 'asc',
) {
  const aIp = a.split('.');
  const bIp = b.split('.');
  for (let i = 0; i < aIp.length; i++) {
    const aIpNum = Number(aIp[i]);
    const bIpNum = Number(bIp[i]);
    if (aIpNum !== bIpNum) {
      return order === 'asc' ? aIpNum - bIpNum : bIpNum - aIpNum;
    }
  }
  return 0;
}

export function sortData(
  sort: string,
  a: VMInstance,
  b: VMInstance,
  order: SortOrderValue = 'asc',
) {
  if (sort === 'ipAddress') {
    return compareIpAddresses(a.publicIpAddress, b.publicIpAddress, order);
  }
  //  sort === 'serverName' || sort === 'default'
  return compareNames(a.serverName, b.serverName, order);
}

export function regroupData(filteredData: VMInstance[], groupBy: GroupByValue) {
  if (groupBy === 'default') return new Map<string, VMInstance[]>();
  const groupedData: Map<string, VMInstance[]> = new Map();
  filteredData.forEach((d) => {
    const group = d[groupBy];
    if (groupedData.has(group)) {
      groupedData.get(group)?.push(d);
    } else {
      groupedData.set(group, [d]);
    }
  });
  return groupedData;
}

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

export function sortGroupedData(
  groupedData: Map<string, VMInstance[]>,
  sort: SortValue,
  order: SortOrderValue = 'asc',
) {
  groupedData.forEach((value, key) => {
    groupedData.set(
      key,
      value.sort((a, b) => sortData(sort, a, b, order)),
    );
  });
}

export const validPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{6,})$/;

export interface FormValues {
  serverName: string;
  machineName: string;
  region: Region;
  password: string;
}

export function generateIpAddress(): string {
  const firstOctet = Math.floor(Math.random() * 256);
  const secondOctet = Math.floor(Math.random() * 256);
  const thirdOctet = Math.floor(Math.random() * 256);
  const fourthOctet = Math.floor(Math.random() * 256);
  return `${firstOctet}.${secondOctet}.${thirdOctet}.${fourthOctet}`;
}
