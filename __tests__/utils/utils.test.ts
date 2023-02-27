import {
  adjustColor,
  adjustComponent,
  capitalize,
  compareIpAddresses,
  compareNames,
  componentToHex,
  formatName,
  sortData,
  titleCase,
} from '@/lib/utils';

import { CreateVmResult } from '@/Services/server/azureService/azure.types';

describe('adjustComponent', () => {
  it('should adjust a color component by a given percentage', () => {
    expect(adjustComponent(255, 0)).toEqual(255); // Should return the same value for 0% adjustment
    expect(adjustComponent(0, 0)).toEqual(0); // Should return the same value for 0% adjustment
    expect(adjustComponent(255, 10)).toEqual(255); // Should return the max value for positive adjustment beyond 100%
    expect(adjustComponent(0, -10)).toEqual(0); // Should return the min value for negative adjustment beyond 0%
    expect(adjustComponent(128, 50)).toEqual(255); // Should return the max value for positive adjustment at 50%
    expect(adjustComponent(128, -50)).toEqual(1); // Should return the min value for negative adjustment at 50%
  });
});

describe('componentToHex', () => {
  it('should convert a color component to a two-digit hexadecimal string', () => {
    expect(componentToHex(0)).toEqual('00'); // Should convert 0 to '00'
    expect(componentToHex(255)).toEqual('FF'); // Should convert 255 to 'FF'
    expect(componentToHex(16)).toEqual('10'); // Should convert 16 to '10'
  });
});

describe('adjustColor', () => {
  it('should adjust a color by a given percentage', () => {
    expect(adjustColor('#ffffff', 10)).toEqual('#FFFFFF'); // Should return the same color for 0% adjustment
    expect(adjustColor('#000000', 10)).toEqual('#1A1A1A'); // Should lighten black by 10%
    expect(adjustColor('#000000', -10)).toEqual('#000000'); // Should return the same color for -100% adjustment
    expect(adjustColor('#0000ff', 50)).toEqual('#8080FF'); // Should lighten blue by 50%
    expect(() => adjustColor('#1234', 10)).toThrowError(
      'Invalid hexadecimal color string.',
    ); // Should throw error for invalid hex code
  });
});

describe('compare and sort utilities functions', () => {
  it('should compare names with the given order', () => {
    const a = 'Android-X86';
    const b = 'android-x86';
    expect(compareNames(a, b, 'asc')).toEqual(1); // Should return -1 for ascending order
    expect(compareNames(a, b, 'desc')).toEqual(-1); // Should return 1 for descending order
    expect(compareNames(a, a, 'asc')).toEqual(0); // Should return 0 for same names
    expect(compareNames(a, 'Zest', 'asc')).toEqual(-1); // Should return -1 for ascending order
  });

  it('should compare IP addresses with the given order', () => {
    const ip1 = '192.168.1.1';
    const ip2 = '220.14.25.36';
    expect(compareIpAddresses(ip1, ip2, 'asc')).toBeLessThanOrEqual(-1);
    expect(compareIpAddresses(ip1, ip2, 'desc')).toBeGreaterThanOrEqual(1);
    expect(compareIpAddresses(ip1, ip1, 'asc')).toEqual(0);
  });

  // export function sortData(
  //   sort: SortValue,
  //   a: CreateVmResult,
  //   b: CreateVmResult,
  //   order: SortOrderValue = 'asc',
  // )
  it('should sort data with the given order', () => {
    // Arrange
    const a = {
      serverName: 'Android-X86',
      publicIpAddress: '192.168.1.1',
    } as CreateVmResult;
    const b = {
      serverName: 'server-remote-desktop',
      publicIpAddress: '207.36.24.1',
    } as CreateVmResult;

    // Act
    const sorResult1 = sortData('ipAddress', a, b, 'asc');
    const sorResult2 = sortData('ipAddress', a, b, 'desc');
    const sorResult3 = sortData('ipAddress', a, a, 'asc');
    const sorResult4 = sortData('name', a, b, 'asc');
    const sorResult5 = sortData('name', a, b, 'desc');
    const sorResult6 = sortData('name', a, a, 'asc');

    // Assert
    expect(sorResult1).toBeLessThanOrEqual(-1);
    expect(sorResult2).toBeGreaterThanOrEqual(1);
    expect(sorResult3).toEqual(0);
    expect(sorResult4).toEqual(-1);
    expect(sorResult5).toEqual(1);
    expect(sorResult6).toEqual(0);
  });
});

describe('String manipulation utilities functions', () => {
  it('should capitalize the first letter of a string', () => {
    expect(capitalize('android-x86')).toEqual('Android-x86');
    expect(capitalize('VMMANAGER')).toEqual('Vmmanager');
    expect(capitalize('CLOUD vmManager')).toEqual('Cloud vmmanager');
  });

  it('Format a word or a sentence to the title case', () => {
    expect(titleCase('android x86')).toEqual('Android X86');
    expect(titleCase('VMMANAGER')).toEqual('Vmmanager');
    expect(titleCase('CLOUD vmManager')).toEqual('Cloud Vmmanager');
  });

  it('Should format Name with first name and last name', () => {
    expect(formatName('John', 'Doe')).toEqual('John D.');
    expect(formatName('Jean Paul', 'Sartre')).toEqual('Jean Paul S.');
  });
});
