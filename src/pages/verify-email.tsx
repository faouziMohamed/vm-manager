/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { useForm } from 'react-hook-form';

import { blackHole } from '@/lib/utils';

import AuthLayout from '@/Components/Layout/AuthLayout';
import AppFormControl from '@/Components/Layout/form/AppFormControl';

type VerifyEmailFormValues = {
  code: string;
};

// TODO: Add a function to handle the form submission
function onsubmit(values: VerifyEmailFormValues) {
  // arriving here means that the form is valid
  blackHole(values);
}

export default function VerifyEmail() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>();

  return (
    <AuthLayout
      onSubmit={handleSubmit(onsubmit)}
      submitButtonTitle='Verify'
      formTitle='Verify Email'
      formAltAction={{
        text: "Don't have a code?",
        link: '/verify-email?resend=true',
        linkText: 'Resend code',
      }}
    >
      <AppFormControl
        isRequired
        placeholder='your email address'
        type='email'
        disabled
        value='faouzi@keystone-int.com'
      />

      <AppFormControl
        isRequired
        label='Verification Code'
        placeholder='Enter the 6 digits here'
        type='number'
        error={errors.code}
        register={register('code', {
          required: true,
          // an exact six-digit number regex pattern
          pattern: /^[0-9]{6}$/,
        })}
        displayError={{ heading: 'The verification code is invalid.' }}
      />
    </AuthLayout>
  );
}
