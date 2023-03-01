import { Button, Stack, ToastId, UseToastOptions } from '@chakra-ui/react';
import { signOut } from 'next-auth/react';
import { useState } from 'react';

import { LOGIN_PAGE } from '@/lib/client-route';
import useAppToast from '@/hooks/useAppToast';

import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import Paragraph from '@/Components/Paragraph';
import { resendEmailVerification } from '@/Services/client/auth.service';
import Theme from '@/styles/theme';

export default function ResendLinkPrompt() {
  const showSuccessToast = useAppToast({
    title: 'Email verification link sent',
    position: 'top',
    status: 'success',
    description:
      "A verification link have been sent to your email, follow the link to continue. If you don't see the email in your inbox, check your spam folder.",
  });

  const showErrorToast = useAppToast({
    title: 'Cannot send email verification link',
    position: 'top',
    status: 'error',
    description:
      'An error occurred while sending the email verification link. Your account may have been deleted, your are not allowed to access this page or you are not logged in.',
  });
  const [isLoading, setIsLoading] = useState(false);
  const onClick = resendVerificationEmail(
    setIsLoading,
    showSuccessToast,
    showErrorToast,
  );
  return (
    <Stack spacing={0}>
      {isLoading && <FuturaSpinner semiTransparent />}
      <Paragraph
        fontFamily='var(--font-secondary)'
        fontSize='0.77rem'
        textAlign='center'
      >
        Don&apos;t have received the mail?{' '}
        <Button
          fontSize='0.77rem'
          variant='link'
          color={Theme.colors.secondary['400']}
          _hover={{
            color: Theme.colors.secondary['500'],
            textDecoration: 'underline',
          }}
          onClick={onClick}
        >
          Resend the link
        </Button>
      </Paragraph>
    </Stack>
  );
}

function resendVerificationEmail(
  setIsLoading: (value: boolean) => void,
  showSuccessToast: (opt?: UseToastOptions) => ToastId,
  showErrorToast: (opt?: UseToastOptions) => ToastId,
) {
  return async () => {
    try {
      setIsLoading(true);
      await resendEmailVerification();
      setIsLoading(false);
      showSuccessToast();
    } catch (e) {
      setIsLoading(false);
      const error = e as Error;
      if (error.name === 'AppUserDoesNotExistException') {
        showErrorToast({
          title: 'Cannot send email verification link',
          description: `${error.message}. You'll be logged out in 10 seconds.`,
        });
        setTimeout(() => {
          void signOut({ callbackUrl: LOGIN_PAGE });
        }, 10000);
        return;
      }
      showErrorToast();
    }
  };
}
