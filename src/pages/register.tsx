/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { useRouter } from 'next/router';
import { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';

import { LOGIN_PAGE, VERIFICATION_LINK_SENT_PAGE } from '@/lib/client-route';
import { AppAuthRegisterUser, AppAuthSignInUser } from '@/lib/types';
import { handleFormSubmit } from '@/lib/utils';

import AppFormControl from '@/Components/form/AppFormControl';
import AuthLayout from '@/Components/Layout/AuthLayout';

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
          pattern:
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[\w\W\s]{6,}$/,
        })}
        displayError={{
          heading: 'The username must follow the following rules:',
          rules: [
            '1 uppercase letter',
            '1 lowercase letter',
            '1 number',
            '1 special character (@$!%*?&)',
          ],
        }}
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
