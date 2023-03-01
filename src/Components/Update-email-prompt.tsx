import { Button } from '@chakra-ui/react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

import useAppToast from '@/hooks/useAppToast';

import AppFormControl from '@/Components/form/AppFormControl';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import Paragraph from '@/Components/Paragraph';
import { updateUserEmail } from '@/Services/client/auth.service';
import Theme from '@/styles/theme';

type VerifyEmailFormValues = {
  email: string;
};
export default function UpdateEmailPrompt({ email }: { email: string }) {
  const {
    register,
    formState: { errors },
  } = useForm<VerifyEmailFormValues>({ mode: 'all' });
  const [emailModificationRequested, setEmailModificationRequested] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const showSuccessToast = useAppToast({
    title: 'Email updated and verification link sent',
    position: 'top',
    status: 'info',
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
  const [emailValue, setEmailValue] = useState(email);
  return (
    <>
      <AppFormControl
        label='Email Address'
        placeholder='your email address'
        type='email'
        error={errors.email}
        value={emailValue}
        onChange={(e) => setEmailValue(e.target.value)}
        register={{
          ...register('email', {
            required: 'Email is required',
            pattern: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          }),
        }}
        displayError={{ heading: 'Email is invalid' }}
        disabled={!emailModificationRequested}
      />
      {isLoading && <FuturaSpinner semiTransparent />}
      {emailModificationRequested ? (
        <>
          <Button
            isDisabled={emailValue === email}
            onClick={async () => {
              try {
                setIsLoading(true);
                await updateUserEmail(emailValue);
                setIsLoading(false);
                showSuccessToast();
                setEmailModificationRequested(false);
              } catch (e) {
                setIsLoading(false);
                const error = e as Error;
                let { message } = error;
                if (error.name === 'AppUserDoesNotExistException') {
                  message =
                    'Your account does not exist, it may have been deleted. This is happening because you have not verified your email in time. Please try to register again.';
                }
                showErrorToast({
                  title: 'Cannot update email',
                  description: message,
                });
              }
            }}
          >
            Update Email
          </Button>
          <Button
            variant='link'
            color={Theme.colors.secondary['400']}
            onClick={() => setEmailModificationRequested(false)}
          >
            Cancel
          </Button>
        </>
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
    </>
  );
}
