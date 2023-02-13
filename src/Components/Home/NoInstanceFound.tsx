import { Flex, Stack } from '@chakra-ui/react';

import { AddNewServerButton } from '@/Components/Layout/header';
import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

export default function NoInstanceFound() {
  return (
    <Stack w='100%' alignItems='center' mt='2rem'>
      <Paragraph fontSize='1.2rem'>You do not have any instance</Paragraph>
      <Flex gap={2} alignItems='center'>
        <Paragraph fontSize='1.2rem'>You start create by creating a </Paragraph>
        <AddNewServerButton
          leftIcon={undefined}
          textAlign='center'
          variant='ghost'
          color={Theme.colors.primary['50']}
          bg={Theme.colors.tertiary.main}
          borderWidth='1px'
        />
      </Flex>
    </Stack>
  );
}
