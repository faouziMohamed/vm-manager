import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Heading,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';

import { capitalize, range } from '@/lib/utils';
import { powerStateColors, VmShortDetails } from '@/lib/vmUtils';

import VmInstanceCard from '@/Components/Home/VmInstanceCard';
import Paragraph from '@/Components/Paragraph';

export default function GroupedVmInstances({
  groupedData,
}: {
  groupedData: Map<string, VmShortDetails[]>;
}) {
  return (
    <Accordion allowMultiple defaultIndex={range(0, groupedData.size)}>
      {Array.from(groupedData.entries()).map(([groupName, dataArray]) => (
        <AccordionItem key={groupName} borderWidth='0 !important'>
          <Stack
            borderWidth='1px'
            borderColor='transparent'
            borderRadius='md'
            py='0.3rem'
            spacing={0}
            _hover={{ borderColor: 'gray.100' }}
          >
            <AccordionButton _hover={{ bg: 'transparent' }}>
              <Heading
                as='h2'
                size='lg'
                display='flex'
                alignItems='center'
                gap='0.3rem'
                justifyContent='space-between'
                w='100%'
              >
                <Paragraph>{capitalize(groupName)}</Paragraph>
                <AccordionIcon fontSize='sm' />
              </Heading>
            </AccordionButton>
            <AccordionPanel borderWidth={0}>
              <SimpleGrid
                borderRadius='md'
                spacing={4}
                templateColumns='repeat(auto-fill, minmax(250px, 1fr))'
              >
                {dataArray.map(({ status, id, ipAddress, name }) => (
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
            </AccordionPanel>
          </Stack>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
