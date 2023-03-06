/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { GetServerSidePropsContext } from 'next';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { LOGIN_PAGE } from '@/lib/client-route';
import { jwtDecode } from '@/lib/server.utils';
import { capitalize } from '@/lib/utils';

import AppFormControl from '@/Components/form/AppFormControl';
import {
  passwordInputError,
  passwordRegex,
} from '@/Components/form/PasswordInput';
import AuthLayout from '@/Components/Layout/AuthLayout';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import AppBlurredModal from '@/Components/Modals/AppBlurredModal';
import Paragraph from '@/Components/Paragraph';
import PageTitle from '@/Components/Seo/PageTitle';
import { getUserByEmail, isVerificationTokenValid } from '@/Repository/queries';
import { resetPassword } from '@/Services/client/client-auth.service';
import { PasswordResetPayload } from '@/Services/server/mail.service';

type ResetPasswordValues = {
  password: string;
  confirmPassword: string;
};
type ResetPasswordPageProps = {
  error: string;
  kind: 'token' | 'user';
  token: string;
};
type GetServerSidePropsReturn =
  | Omit<ResetPasswordPageProps, 'error' | 'kind'>
  | Omit<ResetPasswordPageProps, 'token'>;
export async function getServerSideProps(
  context: GetServerSidePropsContext,
): Promise<{ props: GetServerSidePropsReturn }> {
  const { query } = context;
  const token = query.token as string;
  if (!token) {
    return {
      props: { error: 'No token provided', kind: 'token' },
    };
  }
  const payload = jwtDecode<PasswordResetPayload>(token);
  if (
    !payload ||
    !payload.email ||
    !(await isVerificationTokenValid(payload.userId, token, 'password'))
  ) {
    return {
      props: {
        error: 'The provided token is invalid or expired',
        kind: 'token',
      },
    };
  }

  const { email } = payload;
  const user = await getUserByEmail(email);
  if (!user) {
    return {
      props: {
        error: 'The provided token is invalid or expired',
        kind: 'user',
      },
    };
  }

  return {
    props: { token },
  };
}

export default function ResetPassword(props: ResetPasswordPageProps) {
  const { token, error, kind } = props;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordValues>({ mode: 'all' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anyErrors, setAnyErrors] = useState<string[] | undefined>(undefined);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const onSubmit = useCallback(
    async (values: ResetPasswordValues) => {
      setIsSubmitting(true);
      if (values.password !== values.confirmPassword) {
        setAnyErrors(['Passwords do not match']);
        return;
      }
      setAnyErrors(undefined);
      try {
        await resetPassword(values.password, token);
        setRedirecting(true);
        void router.push(LOGIN_PAGE);
      } catch (err) {
        const { message } = err as Error;
        setAnyErrors([message]);
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, token],
  );
  const session = useSession();
  if (error) {
    return (
      <AppBlurredModal
        isOpen
        onClose={() => void router.push(LOGIN_PAGE)}
        title={kind === 'user' ? 'Account not found' : 'Invalid token'}
      >
        <Paragraph fontSize='1.1rem'>{capitalize(error)}</Paragraph>
      </AppBlurredModal>
    );
  }

  return (
    <AuthLayout
      onSubmit={handleSubmit(onSubmit)}
      submitButtonTitle='Update Password'
      isSubmitting={isSubmitting}
      formTitle='Reset Password'
      errors={anyErrors}
    >
      <PageTitle title='Reset Password' />
      {session.status === 'loading' && <FuturaSpinner semiTransparent />}
      {redirecting && <FuturaSpinner semiTransparent />}
      <AppFormControl
        isRequired
        label='New Password'
        placeholder='your password'
        type='password'
        error={errors.password}
        register={register('password', {
          required: true,
          pattern: passwordRegex,
        })}
        displayError={passwordInputError}
      />
      <AppFormControl
        isRequired
        label='Confirm Password'
        placeholder='Re-enter your password'
        type='password'
        error={errors.password}
        register={register('confirmPassword', {
          required: true,
          pattern: passwordRegex,
        })}
        displayError={passwordInputError}
      />
    </AuthLayout>
  );
}
