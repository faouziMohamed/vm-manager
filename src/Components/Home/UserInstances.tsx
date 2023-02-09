import { useRouter } from 'next/router';

import {
  NextRouterWithQueries,
  regroupData,
  sortData,
  sortGroupedData,
} from '@/lib/utils';
import { sortOptionsValues, VmShortDetails } from '@/lib/vmUtils';

import GroupedVmInstances from '@/Components/Home/GroupedVmInstances';
import NoInstanceFound from '@/Components/Home/NoInstanceFound';
import NoInstanceFoundForAppliedFilter from '@/Components/Home/NoInstanceFoundForAppliedFilter';
import UngroupedVmInstances from '@/Components/Home/UngroupedVmInstances';
import { useVmShortDetails } from '@/Services/hooks';

export default function UserInstances() {
  const { data, error, isLoading } = useVmShortDetails();
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
