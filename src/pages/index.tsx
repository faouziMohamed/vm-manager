import { Box, Button, Stack } from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';

import GroupByMenu from '@/Components/Home/groupByMenu';
import SortDirection from '@/Components/Home/SortDirection';
import SortMenu from '@/Components/Home/sortMenu';
import StatusFilterMenu from '@/Components/Home/statusFilterMenu';
import UserInstances from '@/Components/Home/UserInstances';
import Layout from '@/Components/Layout/Layout';

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
      pb='1rem'
    >
      <StatusFilterMenu />
      <GroupByMenu />
      <SortMenu />
      <SortDirection />
      <Button variant='outline' title='Refresh the view'>
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
