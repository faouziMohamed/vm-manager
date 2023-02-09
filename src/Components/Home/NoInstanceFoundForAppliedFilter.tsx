import { Button, Flex, Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';

import { adjustColor, updateQueryParams } from '@/lib/utils';

import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

export default function NoInstanceFoundForAppliedFilter() {
  const router = useRouter();
  return (
    <Stack mt='2.3rem' alignItems='center' textAlign='center' py='1rem'>
      <Paragraph fontSize='1.2rem'>
        No instances found for the applied filter.
      </Paragraph>
      <Flex gap={3} alignItems='center'>
        <Button
          bg={Theme.colors.danger['100']}
          _hover={{
            bg: adjustColor(Theme.colors.danger['500'], 30),
            color: 'gray.200',
          }}
          _active={{
            bg: adjustColor(Theme.colors.danger['500'], 15),
            color: 'gray.100',
          }}
          variant='solid'
          color='gray.700'
          onClick={() => {
            updateQueryParams(router, { value: 'default' }, 'filter');
          }}
        >
          Reset
        </Button>
        <Paragraph fontSize='1.2rem'>
          the filter to see all instances.
        </Paragraph>
      </Flex>
    </Stack>
  );
}
