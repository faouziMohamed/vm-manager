import { Box, Flex } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { HOME_PAGE, VERIFICATION_LINK_SENT_PAGE } from '@/lib/client-route';

import { HeaderActionButton } from '@/Components/Layout/HeaderUtils';
import UserOptionsAvatar from '@/Components/Layout/UserAvatarMenu';
import UnStyledLink from '@/Components/Links/UnStyledLink';
import Theme from '@/styles/theme';

export default function Header() {
  const { status } = useSession();
  const router = useRouter();
  const shouldDisplayAvatar =
    status === 'authenticated' && router.asPath !== VERIFICATION_LINK_SENT_PAGE;
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
        <UnStyledLink href={HOME_PAGE} fontSize={['0.9rem', '1.2rem']}>
          Manage Servers
        </UnStyledLink>
        {shouldDisplayAvatar && <UserOptionsAvatar />}
        <HeaderActionButton />
      </Flex>
    </Box>
  );
}
