import { SimpleGrid } from '@chakra-ui/react';

import { powerStateColors, VmShortDetails } from '@/lib/vmUtils';

import VmInstanceCard from '@/Components/Home/VmInstanceCard';

export default function UngroupedVmInstances({
  vmShortDetails,
}: {
  vmShortDetails: VmShortDetails[];
}) {
  return (
    <SimpleGrid
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(250px, 1fr))'
    >
      {vmShortDetails.map(({ status, id, ipAddress, name }) => (
        <VmInstanceCard
          key={id}
          dataId={id}
          hex={powerStateColors[status]}
          name={name}
          ipAddress={ipAddress}
          status={status}
        />
      ))}
    </SimpleGrid>
  );
}
