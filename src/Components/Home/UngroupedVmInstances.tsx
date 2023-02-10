import { SimpleGrid } from '@chakra-ui/react';

import { powerStateColors, VMInstance } from '@/lib/vmUtils';

import VmInstanceCard from '@/Components/Home/VmInstanceCard';

export default function UngroupedVmInstances({
  vmShortDetails,
}: {
  vmShortDetails: VMInstance[];
}) {
  return (
    <SimpleGrid
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(250px, 1fr))'
    >
      {vmShortDetails.map(
        ({ status, instanceId, publicIpAddress, serverName }) => (
          <VmInstanceCard
            key={instanceId}
            dataId={instanceId}
            color={powerStateColors[status]}
            serverName={serverName}
            ipAddress={publicIpAddress}
            status={status}
          />
        ),
      )}
    </SimpleGrid>
  );
}
