import { SimpleGrid } from '@chakra-ui/react';

import { powerStateColors } from '@/lib/vmUtils';

import VmInstanceCard from '@/Components/Home/VmInstanceCard';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

export default function UngroupedVmInstances({
  vmShortDetails,
}: {
  vmShortDetails: CreateVmResult[];
}) {
  return (
    <SimpleGrid
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(250px, 1fr))'
    >
      {vmShortDetails.map(
        ({ powerState, instanceId, publicIpAddress, serverName }) => (
          <VmInstanceCard
            key={instanceId}
            instanceId={instanceId}
            color={powerStateColors[powerState]}
            serverName={serverName}
            ipAddress={publicIpAddress}
            status={powerState}
          />
        ),
      )}
    </SimpleGrid>
  );
}
