/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import {
  HOME_PAGE,
  LOGIN_PAGE,
  VERIFICATION_LINK_SENT_PAGE,
} from '@/lib/client-route';
import { AppAuthRegisterUser, AppAuthSignInUser } from '@/lib/types';
import { handleFormSubmit } from '@/lib/utils';

import AppFormControl from '@/Components/form/AppFormControl';
import {
  passwordInputError,
  passwordRegex,
} from '@/Components/form/PasswordInput';
import AuthLayout from '@/Components/Layout/AuthLayout';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AppAuthRegisterUser>({ mode: 'all' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [anyErrors, setAnyErrors] = useState<string[] | undefined>(undefined);
  const router = useRouter();
  const onSubmit = useCallback(
    async (values: AppAuthSignInUser) => {
      // arriving here means that the form is valid
      await handleFormSubmit({
        setIsSubmitting,
        values: { ...values, action: 'register' },
        callbackUrl: VERIFICATION_LINK_SENT_PAGE,
        setAnyErrors,
        router,
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
      submitButtonTitle='Register'
      formTitle='Create an account'
      isSubmitting={isSubmitting}
      errors={anyErrors}
      formAltAction={{
        text: 'having an account?',
        link: LOGIN_PAGE,
        linkText: 'Log In',
      }}
    >
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
      <AppFormControl
        isRequired
        label='First Name'
        placeholder='your first name'
        error={errors.firstname}
        register={register('firstname', { required: true })}
        displayError={{ heading: 'The First Name field is required.' }}
      />

      <AppFormControl
        isRequired
        label='Last Name'
        placeholder='your last name'
        error={errors.lastname}
        register={register('lastname', { required: true })}
        displayError={{ heading: 'The Last Name field is required.' }}
      />
    </AuthLayout>
  );
}
