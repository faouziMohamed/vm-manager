import { Box, Flex } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';

import { HeaderActionButton } from '@/Components/Layout/HeaderUtils';
import UserOptionsAvatar from '@/Components/Layout/UserAvatarMenu';
import UnStyledLink from '@/Components/Links/UnStyledLink';
import Theme from '@/styles/theme';

export default function Header() {
  const { status } = useSession();
  return (
    <Box as='nav' w='100%'>
      <Flex
        as='header'
        justifyContent='space-between'
        alignItems='center'
        bg={Theme.colors.secondary.main}
        px='0.5rem'
        py='0.4rem'
        color='white'
        gap='0.7rem'
      >
        <UnStyledLink href='/' fontSize={['0.9rem', '1.2rem']}>
          Manage Servers
        </UnStyledLink>
        {status === 'authenticated' && <UserOptionsAvatar />}
        <HeaderActionButton />
      </Flex>
    </Box>
  );
}
