/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { HOME_PAGE, SIGNUP_PAGE } from '@/lib/client-route';
import { AppAuthSignInUser } from '@/lib/types';
import { handleFormSubmit } from '@/lib/utils';

import AppFormControl from '@/Components/form/AppFormControl';
import {
  passwordInputError,
  passwordRegex,
} from '@/Components/form/PasswordInput';
import AuthLayout from '@/Components/Layout/AuthLayout';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import PageTitle from '@/Components/Seo/PageTitle';

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppAuthSignInUser>({ mode: 'all' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anyErrors, setAnyErrors] = useState<string[] | undefined>(undefined);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const onSubmit = useCallback(
    async (values: AppAuthSignInUser) => {
      let callbackUrl = HOME_PAGE;
      const { query } = router;
      if (query?.next) {
        callbackUrl = query.next as string;
      }
      // arriving here means that the form is valid
      await handleFormSubmit({
        setIsSubmitting,
        onRedirecting: () => setRedirecting(true),
        values: { ...values, action: 'signin' },
        setAnyErrors,
        router,
        callbackUrl,
      });
    },
    [router],
  );
  const session = useSession();
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
      onSubmit={handleSubmit(onSubmit)}
      submitButtonTitle='Log In'
      isSubmitting={isSubmitting}
      formTitle='Sign In'
      formAltAction={{
        text: "Don't have an account?",
        link: SIGNUP_PAGE,
        linkText: 'Sign Up',
      }}
      formAltAction2={{
        text: 'Forgot your password?',
        link: '/forgot-password',
        linkText: 'Reset it',
      }}
      errors={anyErrors}
    >
      <PageTitle title='Sign In' />
      {session.status === 'loading' && <FuturaSpinner semiTransparent />}
      {redirecting && <FuturaSpinner semiTransparent />}
      <AppFormControl
        isRequired
        label='Email Address'
        placeholder='your email address'
        error={errors.email}
        type='email'
        register={register('email', {
          required: true,
          pattern: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
        })}
        displayError={{ heading: 'The email address is invalid.' }}
      />
      <AppFormControl
        isRequired
        label='Password'
        placeholder='your password'
        type='password'
        error={errors.password}
        register={register('password', {
          required: true,
          pattern: passwordRegex,
        })}
        displayError={passwordInputError}
      />
    </AuthLayout>
  );
}
