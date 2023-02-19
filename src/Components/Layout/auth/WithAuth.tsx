// import router from 'next/router';
import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

type WithAuthProps = {
  children: JSX.Element;
  options?: { redirectTo?: string };
};

function WithAuth(props: WithAuthProps) {
  const { children, options } = props;
  const { data: session, status } = useSession({ required: true });
  const isUser = !!session?.user;
  const router = useRouter();
  useEffect(() => {
    // Do nothing while loading
    if (status === 'loading') {
      return;
    }

    const currentPath = router.asPath;
    // If not authenticated, redirect to provided url or
    if (!isUser) {
      if (options?.redirectTo) {
        void router.push({
          pathname: '/signin',
          query: { next: options?.redirectTo || currentPath },
        });
      } else {
        void signIn();
      }
    }
  }, [isUser, options?.redirectTo, router, status]);
  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>;
}

export default WithAuth;
