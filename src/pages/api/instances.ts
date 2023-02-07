import { NextApiResponse } from 'next';
import nc from 'next-connect';

import { PowerStateValue } from '@/lib/vmUtils';

export type VmDetailsShort = {
  id: string;
  name: string;
  region: string;
  status: PowerStateValue;
  ipAddress: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

const instances: VmDetailsShort[] = [
  {
    id: 'db4ddad6-1355-4e7f-a016-268b631ba80d',
    name: 'Jailbreak Root',
    region: 'us-west-2',
    status: 'creating',
    ipAddress: '100.100.100.6',
    createdAt: '2021-08-05T12:00:00.000Z',
    updatedAt: '2021-08-05T12:00:00.000Z',
  },
  {
    id: '842ee694-4fab-4e96-a688-1a9a2fdb72e2',
    name: 'Turbo-Lambda',
    region: 'us-west-2',
    status: 'running',
    ipAddress: '100.100.100.3',
    createdAt: '2021-08-02T12:00:00.000Z',
    updatedAt: '2021-08-02T12:00:00.000Z',
  },
  {
    id: '62aaa169-0956-4c5c-ae4c-18bbd313ed14',
    name: 'Android X86 Cloud',
    region: 'us-west-2',
    status: 'creating',
    ipAddress: '192.168.12.7',
    createdAt: '2021-08-06T12:00:00.000Z',
    updatedAt: '2021-08-06T12:00:00.000Z',
  },
  {
    id: '41b3419d-bba7-49eb-9699-a427cdc83006',
    name: 'GPT-3 Game',
    region: 'us-east-1',
    status: 'running',
    ipAddress: '100.100.100.2',
    createdAt: '2021-08-01T12:00:00.000Z',
    updatedAt: '2021-08-01T12:00:00.000Z',
  },
  {
    id: '83f5b606-47a4-4317-a661-756a8191d2c2',
    name: 'GPT-3 Android X86',
    region: 'us-east-1',
    status: 'stopped',
    ipAddress: '192.168.12.2',
    createdAt: '2021-08-01T12:00:00.000Z',
    updatedAt: '2021-08-01T12:00:00.000Z',
  },
  {
    id: '077ce0c3-7b46-4d40-8d36-b80d1df3586b',
    name: 'PUBG Server',
    region: 'us-west-2',
    status: 'stopped',
    ipAddress: '100.100.100.4',
    createdAt: '2021-08-03T12:00:00.000Z',
    updatedAt: '2021-08-03T12:00:00.000Z',
  },
  {
    id: '01e87991-90ca-47e7-a9e7-cacf603e9a34',
    name: 'Win X86 Android',
    region: 'us-east-1',
    status: 'running',
    ipAddress: '192.168.12.2',
    createdAt: '2021-08-01T12:00:00.000Z',
    updatedAt: '2021-08-01T12:00:00.000Z',
  },
  {
    id: '77e931c3-139c-4778-80d8-ba58b3fc0316',
    name: 'X86 Dev Machine',
    region: 'us-west-2',
    status: 'stopped',
    ipAddress: '192.168.12.6',
    createdAt: '2021-08-05T12:00:00.000Z',
    updatedAt: '2021-08-05T12:00:00.000Z',
  },
  {
    id: 'f482ac52-3a72-4ea4-8e16-d18161216635',
    name: 'Turbo-Lambda X86',
    region: 'us-west-2',
    status: 'restarting',
    ipAddress: '192.168.12.3',
    createdAt: '2021-08-02T12:00:00.000Z',
    updatedAt: '2021-08-02T12:00:00.000Z',
  },
  {
    id: '0a505aeb-4f02-457c-aadd-ceb26f17075e',
    name: 'PUBG Server X86',
    region: 'us-west-2',
    status: 'stopped',
    ipAddress: '192.168.12.4',
    createdAt: '2021-08-03T12:00:00.000Z',
    updatedAt: '2021-08-03T12:00:00.000Z',
  },
  {
    id: '36933750-fe8c-4aa2-81a1-59f4f6aceb8e',
    name: 'RDP Win X86',
    region: 'us-west-2',
    status: 'running',
    ipAddress: '100.100.100.5',
    createdAt: '2021-08-04T12:00:00.000Z',
    updatedAt: '2021-08-04T12:00:00.000Z',
  },
  {
    id: '12e5c90e-3126-45e4-ab1c-87318092a53b',
    name: 'Android X86 Final',
    region: 'us-west-2',
    status: 'running',
    ipAddress: '192.168.12.5',
    createdAt: '2021-08-04T12:00:00.000Z',
    updatedAt: '2021-08-04T12:00:00.000Z',
  },
];

const handler = nc();

handler.get((req, res: NextApiResponse<VmDetailsShort[]>) => {
  res.json(instances);
});

export default handler;
