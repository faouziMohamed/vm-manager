import { Box, Button, Stack } from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';

import GroupByMenu from '@/Components/Home/groupByMenu';
import SortDirection from '@/Components/Home/SortDirection';
import SortMenu from '@/Components/Home/sortMenu';
import StatusFilterMenu from '@/Components/Home/statusFilterMenu';
import UserInstances from '@/Components/Home/UserInstances';
import Layout from '@/Components/Layout/Layout';
import { refreshVmInstances } from '@/Services/client/vm.service';

export default function Home() {
  return (
    <Layout>
      <QueriesComponentSection />
      <UserVmInstancesSection />
    </Layout>
  );
}

function QueriesComponentSection() {
  return (
    <Stack
      gap='0.3rem'
      direction='row'
      alignItems='center'
      flexWrap='wrap'
      justifyContent='center'
      pt={{ sm: '0.5rem' }}
      pb='1.5rem'
    >
      <StatusFilterMenu />
      <GroupByMenu />
      <SortMenu />
      <SortDirection />
      <Button
        variant='outline'
        title='Refresh the view'
        // eslint-disable-next-line @typescript-eslint/no-misused-promises
        onClick={refreshVmInstances}
      >
        <MdRefresh />
      </Button>
    </Stack>
  );
}

function UserVmInstancesSection() {
  return (
    <Box px={{ xsm: '1rem' }}>
      <UserInstances />
    </Box>
  );
}

// Home.auth = {
//   redirectTo: '/',
// };
