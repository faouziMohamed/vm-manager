/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import {
  Button,
  Divider,
  Stack,
  ToastId,
  UseToastOptions,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { signOut, useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { HOME_PAGE, LOGIN_PAGE } from '@/lib/client-route';
import { adjustColor } from '@/lib/utils';
import useAppToast from '@/hooks/useAppToast';

import AppFormControl from '@/Components/form/AppFormControl';
import AuthLayout from '@/Components/Layout/AuthLayout';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import Paragraph from '@/Components/Paragraph';
import PageTitle from '@/Components/Seo/PageTitle';
import { requestPasswordReset } from '@/Services/client/client-auth.service';
import Theme from '@/styles/theme';

type ResetPasswordFields = { email: string };

type SendPasswordResetRequestProps = {
  setIsLoading: (value: boolean) => void;
  values: ResetPasswordFields;
  showSuccessToast: (opt?: UseToastOptions) => ToastId;
  showErrorToast: (opt?: UseToastOptions) => ToastId;
};

export default function ForgotPassword() {
  const router = useRouter();
  const session = useSession();
  const {
    register,
    formState: { errors },
  } = useForm<ResetPasswordFields>({ mode: 'all' });
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
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
  const onSubmit = useCallback(
    async (values: ResetPasswordFields) => {
      await sendPasswordResetRequest({
        setIsLoading,
        values,
        showSuccessToast,
        showErrorToast,
      });
    },
    [showErrorToast, showSuccessToast],
  );

  if (session.status === 'authenticated') {
    const next = router.query.next as string;
    if (next) {
      void router.push(next);
      return <FuturaSpinner semiTransparent />;
    }
    void router.push(HOME_PAGE);
    return <FuturaSpinner semiTransparent />;
  }

  return (
    <AuthLayout
      submitButtonTitle='Verify'
      hasForm={false}
      formTitle='Forgot Password'
    >
      <PageTitle title='Forgot Password ?' />
      <Stack
        color={Theme.colors.secondary.main}
        spacing={0}
        w='100%'
        alignItems='center'
      >
        <Paragraph textAlign='center'>
          To reset your password, enter the email address you use to sign in to
          your account.
        </Paragraph>
      </Stack>
      <AppFormControl
        label='Email Address'
        placeholder='your email address'
        type='email'
        error={errors.email}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        register={{
          ...register('email', {
            required: 'Email is required',
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          }),
        }}
        displayError={{ heading: 'Typed email is invalid' }}
      />
      <Divider />

      <Button
        isDisabled={isLoading || !email}
        isLoading={isLoading}
        bg={Theme.colors.warning.main}
        color={Theme.colors.warning['50']}
        _hover={{ bg: adjustColor(Theme.colors.warning.main, 10) }}
        _active={{ bg: adjustColor(Theme.colors.warning.main, 20) }}
        onClick={() => onSubmit({ email })}
      >
        Send Reset Link
      </Button>
      <Paragraph textAlign='center' color={Theme.colors.warning.main}>
        The link will expire in 2 hours, after that you will have to request a
        new link.
      </Paragraph>
    </AuthLayout>
  );
}

async function sendPasswordResetRequest(props: SendPasswordResetRequestProps) {
  const { setIsLoading, values, showSuccessToast, showErrorToast } = props;
  setIsLoading(true);
  try {
    await requestPasswordReset(values.email);
    showSuccessToast();
  } catch (e) {
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
  } finally {
    setIsLoading(false);
  }
}
