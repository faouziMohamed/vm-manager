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
import { useRouter } from 'next/router';
import useSWR from 'swr';

import {
  capitalize,
  getInstances,
  NextRouterWithQueries,
  range,
  regroupData,
  sortData,
} from '@/lib/utils';
import {
  powerStateColors,
  sortOptionsValues,
  SortOrderValue,
  SortValue,
  VmShortDetails,
} from '@/lib/vmUtils';

import NoInstanceFound from '@/Components/Home/NoInstanceFound';
import NoInstanceFoundForAppliedFilter from '@/Components/Home/NoInstanceFoundForAppliedFilter';
import VmInstanceCard from '@/Components/Home/VmInstanceCard';
import Paragraph from '@/Components/Paragraph';

function sortGroupedData(
  groupedData: Map<string, VmShortDetails[]>,
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

export default function UserInstances() {
  const { data, error, isLoading } = useSWR<VmShortDetails[], Error>(
    '/api/instances',
    getInstances,
  );
  const router = useRouter() as NextRouterWithQueries;
  if (isLoading) return <div>Loading instances...</div>;
  if (!isLoading && error) return <div>Failed to load instances</div>;

  const {
    query: { filter, group_by: groupBy, sort, sort_order: sortOrder },
  } = router;

  if (!data) return <NoInstanceFound />;

  let filteredData: VmShortDetails[] = data ?? [];
  if (filter && filter !== 'default') {
    filteredData = data.filter((d) => d.status === filter) ?? [];
  }
  if (filteredData.length === 0) return <NoInstanceFoundForAppliedFilter />;

  let groupedData = new Map<string, VmShortDetails[]>();
  if (groupBy && groupBy !== 'default') {
    groupedData = regroupData(filteredData, groupBy);
    // console.dir(groupedData, { depth: null });
  }

  if (sort && sortOptionsValues.includes(sort)) {
    if (groupedData.size > 0) {
      sortGroupedData(groupedData, sort, sortOrder);
      // create an array of number where its length is equal to the number of groups
    } else {
      filteredData = filteredData.sort((a, b) =>
        sortData(sort, a, b, sortOrder),
      );
    }
  }

  return groupedData.size > 0 ? (
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
  ) : (
    <SimpleGrid
      spacing={4}
      templateColumns='repeat(auto-fill, minmax(250px, 1fr))'
    >
      {filteredData.map(({ status, id, ipAddress, name }) => (
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
