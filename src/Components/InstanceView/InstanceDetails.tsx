import { Heading, SimpleGrid, Stack } from '@chakra-ui/react';

import { mapInstanceToVmDetails } from '@/lib/utils';

import Paragraph from '@/Components/Paragraph';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

export default function InstanceDetails(props: { instance: CreateVmResult }) {
  const { instance } = props;
  const details = mapInstanceToVmDetails(instance);
  return (
    <Stack spacing={5} fontFamily='var(--font-primary)'>
      {details.map((detail) => (
        <SimpleGrid
          key={detail.name}
          templateColumns={{ base: '1fr', sm: ' 180px 1fr' }}
          borderBottomWidth={1}
        >
          <Heading
            fontFamily='var(--font-secondary)'
            flex='1 0 20%'
            as='h3'
            size='sm'
          >
            {detail.name}
          </Heading>
          <Paragraph color='gray.600' textAlign='start'>
            {detail.value}
          </Paragraph>
        </SimpleGrid>
      ))}
    </Stack>
  );
}
