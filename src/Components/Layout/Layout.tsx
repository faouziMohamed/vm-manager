import { Box, Box as Main, Flex, SimpleGrid } from '@chakra-ui/react';
import { ReactNode } from 'react';

import Header from '@/Components/Layout/header';
import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

export default function Layout({ children }: { children: ReactNode }) {
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
          {children}
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
