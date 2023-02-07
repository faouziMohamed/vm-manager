import { SimpleGrid } from '@chakra-ui/react';
import { NextRouter, useRouter } from 'next/router';
import useSWR from 'swr';

import { powerStateColors, PowerStateValue } from '@/lib/vmUtils';

import NoInstanceFound from '@/Components/Home/NoInstanceFound';
import NoInstanceFoundForAppliedFilter from '@/Components/Home/NoInstanceFoundForAppliedFilter';
import VmInstanceCard from '@/Components/Home/VmInstanceCard';
import { VmDetailsShort } from '@/pages/api/instances';

const getInstances = async () => {
  const res = await fetch('/api/instances');
  return (await res.json()) as VmDetailsShort[];
};
type NextRouterWithFilter = NextRouter & {
  query: { filter?: PowerStateValue };
};

export default function UserInstances() {
  const { data, error, isLoading } = useSWR<VmDetailsShort[], Error>(
    '/api/instances',
    getInstances,
  );
  const router = useRouter() as NextRouterWithFilter;
  if (isLoading) return <div>Loading instances...</div>;
  if (!isLoading && error) return <div>Failed to load instances</div>;

  const {
    query: { filter },
  } = router;

  if (!data) return <NoInstanceFound />;

  let filteredData: VmDetailsShort[] = data ?? [];
  if (filter && filter !== 'all') {
    filteredData = data?.filter((d) => d.status === filter) ?? [];
  }

  if (filteredData.length === 0) return <NoInstanceFoundForAppliedFilter />;
  return (
    <SimpleGrid
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(225px, 1fr))'
    >
      {filteredData.map(({ status, id, ipAddress, name }) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const color = powerStateColors[status];
        return (
          <VmInstanceCard
            key={id}
            dataId={id}
            hex={color}
            name={name}
            ipAddress={ipAddress}
            status={status}
          />
        );
      })}
    </SimpleGrid>
  );
}
