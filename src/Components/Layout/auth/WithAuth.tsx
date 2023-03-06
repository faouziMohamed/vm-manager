import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { LOGIN_PAGE, VERIFICATION_LINK_SENT_PAGE } from '@/lib/client-route';
import { AppUser } from '@/lib/types';

import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';

type WithAuthProps = {
  children: JSX.Element;
  options?: { redirectTo?: string };
};

function WithAuth(props: WithAuthProps) {
  const { children, options } = props;
  const router = useRouter();
  const { data: session, status } = useSession();
  useEffect(() => {
    // Do nothing while loading
    if (status === 'loading') {
      return;
    }

    const currentPath = router.asPath;
    // console.log('currentPath', currentPath, router);
    // If not authenticated, redirect to provided url or
    if (!session?.user) {
      if (options?.redirectTo) {
        void router.push(options?.redirectTo);
      } else {
        const next = new URLSearchParams({ next: currentPath });
        void router.push(LOGIN_PAGE, { query: next.toString() });
      }
    }
  }, [options?.redirectTo, router, session?.user, status]);

  if (!session?.user) {
    return <FuturaSpinner />;
  }

  const user = session.user as AppUser;
  const isUserEmailNotVerified = user.emailVerified === false;
  const isNotVerificationPage = router.asPath !== VERIFICATION_LINK_SENT_PAGE;
  if (isUserEmailNotVerified && isNotVerificationPage) {
    void router.push(VERIFICATION_LINK_SENT_PAGE);
    return <FuturaSpinner semiTransparent />;
  }

  return children;
}

export default WithAuth;
