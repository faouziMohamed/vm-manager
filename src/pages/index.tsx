import {
  Box,
  Box as Main,
  Button,
  Flex,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { MdRefresh } from 'react-icons/md';

import GroupByMenu from '@/Components/Home/groupByMenu';
import SortMenu from '@/Components/Home/sortMenu';
import StatusFilterMenu from '@/Components/Home/statusFilterMenu';
import UserInstances from '@/Components/Home/UserInstances';
import Header from '@/Components/Layout/header';
import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

export default function Home() {
  return (
    <SimpleGrid
      w='100%'
      h='100%'
      overflow='hidden'
      spacing={0}
      templateColumns='1fr'
      templateRows='auto 1fr auto'
      inset={0}
      pos='absolute'
    >
      <Header />
      <Main as='main' py='1.5rem' px='1rem' w='100%' overflowX='auto'>
        <Box marginX='auto' maxW='5xl' w='100'>
          <Stack
            gap='0.3rem'
            direction='row'
            alignItems='center'
            flexWrap='wrap'
            justifyContent='center'
            pb='1rem'
          >
            <StatusFilterMenu onSelect={() => {}} />
            <GroupByMenu />
            <SortMenu />
            <Button variant='outline' title='Refresh the view'>
              <MdRefresh />
            </Button>
          </Stack>
          <Box px={{ xsm: '1rem' }}>
            <UserInstances />
          </Box>
        </Box>
      </Main>
      <Flex
        direction='column'
        justifyContent='space-between'
        alignItems='center'
        bg={Theme.colors.tertiary.main}
        px='0.5rem'
        py='0.4rem'
        color='white'
        gap='0.1rem'
      >
        <Paragraph fontSize='0.9rem'>Powered by</Paragraph>

        <Paragraph fontFamily='var(--font-secondary)' fontSize='0.9rem'>
          CSentinel, Copyright © {new Date(Date.now()).getFullYear()}
        </Paragraph>
      </Flex>
    </SimpleGrid>
  );
}
