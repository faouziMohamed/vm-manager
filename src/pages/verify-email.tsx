/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { Button, Stack } from '@chakra-ui/react';
import { useSession } from 'next-auth/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import { AppUser } from '@/lib/types';
import { blackHole } from '@/lib/utils';

import AppFormControl from '@/Components/form/AppFormControl';
import AuthLayout from '@/Components/Layout/AuthLayout';
import Paragraph from '@/Components/Paragraph';
import Theme from '@/styles/theme';

type VerifyEmailFormValues = {
  email: string;
};

// TODO: Add a function to handle the form submission
function onsubmit(values: VerifyEmailFormValues) {
  // arriving here means that the form is valid
  blackHole(values);
}
VerifyEmail.auth = true;

export default function VerifyEmail() {
  const [emailModificationRequested, setEmailModificationRequested] =
    useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({ mode: 'all' });
  const { data } = useSession();
  const { email } = data!.user as AppUser;
  return (
    <AuthLayout
      onSubmit={handleSubmit(onsubmit)}
      submitButtonTitle='Verify'
      hasForm={false}
      formTitle='Email verification'
    >
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
      <AppFormControl
        label='Email Address'
        placeholder='your email address'
        type='email'
        error={errors.email}
        value={email}
        register={{
          ...register('email', {
            required: 'Email is required',
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          }),
        }}
        displayError={{ heading: 'Email is invalid' }}
        disabled={!emailModificationRequested}
      />

      {emailModificationRequested ? (
        <Button onClick={() => setEmailModificationRequested(false)}>
          Update Email
        </Button>
      ) : (
        <Paragraph
          fontFamily='var(--font-secondary)'
          fontSize='0.77rem'
          textAlign='center'
        >
          Wrong email?{' '}
          <Button
            fontSize='0.77rem'
            color={Theme.colors.secondary['400']}
            _hover={{ color: Theme.colors.secondary['500'] }}
            variant='link'
            onClick={() => setEmailModificationRequested(true)}
          >
            modify email
          </Button>
        </Paragraph>
      )}
      <Paragraph textAlign='center' color={Theme.colors.warning.main}>
        The link will expire in 2 hours, if you don&apos;t verify your email in
        that time your account will be deleted.
      </Paragraph>
      <Stack spacing={0}>
        {/* <Divider /> */}
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
            _hover={{ color: Theme.colors.secondary['500'] }}
            onClick={() => {}}
          >
            Resend the link
          </Button>
        </Paragraph>
      </Stack>
    </AuthLayout>
  );
}
