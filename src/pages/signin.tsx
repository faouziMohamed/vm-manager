/* eslint-disable react/jsx-props-no-spreading,@typescript-eslint/no-misused-promises */
import { useForm } from 'react-hook-form';

import { blackHole } from '@/lib/utils';

import AuthLayout from '@/Components/Layout/AuthLayout';
import AppFormControl from '@/Components/Layout/form/AppFormControl';

type SignInFormValues = {
  username: string;
  password: string;
};

// TODO: Add a function to handle the form submission
function onsubmit(values: SignInFormValues) {
  // arriving here means that the form is valid
  blackHole(values);
}
export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormValues>();

  return (
    <AuthLayout
      onSubmit={handleSubmit(onsubmit)}
      submitButtonTitle='Log In'
      formTitle='Sign In'
      formAltAction={{
        text: "Don't have an account?",
        link: '/register',
        linkText: 'Sign Up',
      }}
    >
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
    </AuthLayout>
  );
}
