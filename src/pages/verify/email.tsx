import { Box } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { COMPLETE_REGISTRATION_PAGE, LOGIN_PAGE } from '@/lib/client-route';
import { AppException } from '@/lib/Exceptions/app.exceptions';
import { capitalize } from '@/lib/utils';

import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
import AppBlurredModal from '@/Components/Modals/AppBlurredModal';
import Paragraph from '@/Components/Paragraph';
import PageTitle from '@/Components/Seo/PageTitle';
import { tryVerifyUser } from '@/Services/client/client-auth.service';
import { requestUserSessionUpdate } from '@/Services/client/users.service';

function TokenVerifyError(props: { error: string }) {
  const router = useRouter();
  const { error } = props;
  const onclose = () => {
    void router.push(LOGIN_PAGE);
  };
  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <AppBlurredModal isOpen onClose={onclose} title='Verification Error'>
      <PageTitle title="Can't verify email" />
      <Paragraph fontSize='1.1rem' textAlign='center'>
        {capitalize(error)}.
      </Paragraph>
    </AppBlurredModal>
  );
}

export default function EmailVerify() {
  const router = useRouter();
  const [verificationComplete, setVerificationComplete] = useState(false);
  const token = router.query.token as string;
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!router.query.token) return;
    void tryVerifyUser(router.query.token as string)
      // eslint-disable-next-line promise/always-return
      .then(async () => {
        await requestUserSessionUpdate();
        setVerificationComplete(true);
      })
      .catch((err) => {
        const e = err as AppException;
        setError(e.message);
      });
  }, [router.query.token]);

  if (verificationComplete) {
    const qParam = new URLSearchParams({
      next: COMPLETE_REGISTRATION_PAGE,
    });
    const url = `${LOGIN_PAGE}?${qParam.toString()}`;
    void router.push(url);
    return <FuturaSpinner />;
  }
  if (!token)
    return (
      <Box>
        <PageTitle title='Verify Email Error' />
        <Paragraph>Token missing</Paragraph>
      </Box>
    );

  if (error) return <TokenVerifyError error={error} />;
  return (
    <Box>
      <PageTitle title='Verifying Email...' />
      <Paragraph>Verifying email...</Paragraph>
    </Box>
  );
}
