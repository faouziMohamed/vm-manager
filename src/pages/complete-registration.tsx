import { Button, Divider, Heading, Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { RiBillLine } from 'react-icons/ri';

import { HOME_PAGE } from '@/lib/client-route';
import { AppUser } from '@/lib/types';
import { adjustColor, capitalize } from '@/lib/utils';

import AuthLayout from '@/Components/Layout/AuthLayout';
import UnderlineLink from '@/Components/Links/UnderlineLink';
import Paragraph from '@/Components/Paragraph';
import UpdatableUserAvatar from '@/Components/UpdatableUserAvatar';
import Theme from '@/styles/theme';

CompleteRegistration.auth = true;

export default function CompleteRegistration() {
  const { data } = useSession();
  const user = data?.user as AppUser;
  return (
    <AuthLayout
      hasForm={false}
      formTitle='Complete Registration'
      submitButtonTitle='Next (Billing Information)'
    >
      <Stack spacing={4} alignItems='center'>
        <Heading as='h3' fontWeight={500} fontSize='1rem' color='secondary.500'>
          Upload a profile picture
        </Heading>
        <UpdatableUserAvatar user={user} />
        <Heading as='h3' fontWeight={600} fontSize='1.4rem'>
          {capitalize(user.firstname)} {capitalize(user.lastname)}
        </Heading>
        <Paragraph color='#01266E'>
          You can
          <UnderlineLink
            href={HOME_PAGE}
            fontWeight='400'
            fontFamily='var(--font-primary)'
          >
            skip
          </UnderlineLink>
          this part and complete it later
        </Paragraph>
      </Stack>
      <Divider />
      <Button
        type='submit'
        // isLoading={isSubmitting}
        bg={Theme.colors.primary.main}
        color={Theme.colors.primary['50']}
        _hover={{ bg: adjustColor(Theme.colors.primary.main, 10) }}
        _active={{ bg: adjustColor(Theme.colors.primary.main, 20) }}
        leftIcon={<RiBillLine size='1.3rem' />}
      >
        Next (Billing Information)
      </Button>
    </AuthLayout>
  );
}
