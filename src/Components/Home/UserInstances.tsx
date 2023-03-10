import { useRouter } from 'next/router';

import { sortOptionsValues } from '@/lib/constants';
import { NextRouterWithQueries } from '@/lib/types';
import { regroupData, sortData, sortGroupedData } from '@/lib/utils';

import GroupedVmInstances from '@/Components/Home/GroupedVmInstances';
import NoInstanceFound from '@/Components/Home/NoInstanceFound';
import NoInstanceFoundForAppliedFilter from '@/Components/Home/NoInstanceFoundForAppliedFilter';
import UngroupedVmInstances from '@/Components/Home/UngroupedVmInstances';
import Paragraph from '@/Components/Paragraph';
import { useCurrentUserVmInstances } from '@/Services/client/vm.service';
import { CreateVmResult } from '@/Services/server/azureService/azure.types';

export default function UserInstances() {
  const { data, error, isLoading } = useCurrentUserVmInstances();
  const router = useRouter() as NextRouterWithQueries;
  if (isLoading) {
    return <Paragraph fontSize='1.2rem'>Loading instances...</Paragraph>;
  }
  if (!isLoading && (error || !data)) {
    return <Paragraph fontSize='1.2rem'>Failed to load instances</Paragraph>;
  }
  if (!isLoading && !error && !data?.length) {
    return <NoInstanceFound />;
  }
  const {
    query: { filter, group_by: groupBy, sort, sort_order: sortOrder },
  } = router;

  let filteredData: CreateVmResult[] = data ?? [];
  if (filter && filter !== 'default') {
    filteredData = data?.filter((d) => d.powerState === filter) ?? [];
  }
  if (filteredData.length === 0) return <NoInstanceFoundForAppliedFilter />;

  let groupedData = new Map<string, CreateVmResult[]>();
  if (groupBy && groupBy !== 'default') {
    groupedData = regroupData(filteredData, groupBy);
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
    <GroupedVmInstances groupedData={groupedData} />
  ) : (
    <UngroupedVmInstances vmShortDetails={filteredData} />
  );
}
