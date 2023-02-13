/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { useForm } from 'react-hook-form';

import { blackHole } from '@/lib/utils';

import AuthLayout from '@/Components/Layout/AuthLayout';
import AppFormControl from '@/Components/Layout/form/AppFormControl';

type RegisterFormValues = {
  name: string;
  email: string;
  username: string;
  password: string;
};

// TODO: Add a function to handle the form submission
function onsubmit(values: RegisterFormValues) {
  // arriving here means that the form is valid
  blackHole(values);
}

export default function Register() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>();

  return (
    <AuthLayout
      onSubmit={handleSubmit(onsubmit)}
      submitButtonTitle='Register'
      formTitle='Create an account'
      formAltAction={{
        text: 'having an account?',
        link: '/signin',
        linkText: 'Log In',
      }}
    >
      {/* // The expression checks for a valid username */}
      <AppFormControl
        isRequired
        label='Name'
        placeholder='your name'
        error={errors.name}
        register={register('name', { required: true })}
        displayError={{ heading: 'The name field is required.' }}
      />
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
        label='Username'
        placeholder='your username'
        error={errors.username}
        register={register('username', {
          required: true,
          pattern: /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/,
        })}
        displayError={{
          heading: 'The username must follow the following rules:',
          rules: [
            'Usernames must start with a letter or a number.',
            'Usernames must be at least 4 characters long.',
            'Usernames must not be longer than 20 characters.',
            'Usernames may contain letters (uppercase or lowercase), numbers, or hyphens.',
            'Usernames may not contain spaces or other special characters.',
          ],
        }}
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

      {/* <HStack> */}
      {/*  <Checkbox colorScheme='green' /> */}
      {/*  <Paragraph textAlign='end' fontSize='0.8rem'> */}
      {/*    I have read and agree to the{' '} */}
      {/*    <UnderlineLink href='/terms'>Terms and Conditions</UnderlineLink> */}
      {/*  </Paragraph> */}
      {/* </HStack> */}
    </AuthLayout>
  );
}
