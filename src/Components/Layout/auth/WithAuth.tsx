import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

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
  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      const currentPath = router.asPath;
      // If not authenticated, redirect to provided url or
      if (options?.redirectTo) {
        void router.push(options?.redirectTo);
      } else {
        const params = new URLSearchParams(
          router.query as Record<string, string>,
        );
        params.set('next', currentPath);
        const url = `${LOGIN_PAGE}?${params.toString()}`;
        void router.push(url);
      }
    },
  });
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
