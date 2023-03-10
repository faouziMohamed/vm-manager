/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { Stack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

import { HOME_PAGE } from '@/lib/client-route';
import { AppUser } from '@/lib/types';

import AuthLayout from '@/Components/Layout/AuthLayout';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import Paragraph from '@/Components/Paragraph';
import ResendLinkPrompt from '@/Components/Resend-link-prompt';
import PageTitle from '@/Components/Seo/PageTitle';
import UpdateEmailPrompt from '@/Components/Update-email-prompt';
import Theme from '@/styles/theme';

export default function VerifyEmail() {
  const { data } = useSession();
  const user = data?.user as AppUser;
  const router = useRouter();
  if (user?.emailVerified) {
    void router.push(HOME_PAGE);
    return <FuturaSpinner semiTransparent />;
  }
  const { email } = user;
  return (
    <AuthLayout
      submitButtonTitle='Verify'
      hasForm={false}
      formTitle='Email verification'
    >
      <PageTitle title={`Verify email - ${email}`} />
      <Stack
        color={Theme.colors.secondary.main}
        spacing={0}
        w='100%'
        alignItems='center'
      >
        <Paragraph textAlign='center'>
          A verification link have been sent to your email, follow the link to
          continue. If you don&apos;t see the email in your inbox, check your
          spam folder.
        </Paragraph>
      </Stack>
      <UpdateEmailPrompt email={email} />
      <Paragraph textAlign='center' color={Theme.colors.warning.main}>
        The link will expire in 2 hours, if you don&apos;t verify your email in
        that time your account will be deleted.
      </Paragraph>
      <ResendLinkPrompt />
    </AuthLayout>
  );
}

VerifyEmail.auth = true;
