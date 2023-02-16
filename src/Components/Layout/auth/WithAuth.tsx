import router from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import { useEffect } from 'react';

function WithAuth({
  children,
  options,
}: {
  children: JSX.Element;
  options?: { redirectTo?: string };
}) {
  const { data: session, status } = useSession({ required: true });
  const isUser = !!session?.user;
  useEffect(() => {
    // Do nothing while loading
    if (status === 'loading') {
      return;
    }

    // If not authenticated, redirect to provided url or
    if (!isUser) {
      if (options?.redirectTo) {
        void router.push(options.redirectTo);
      } else {
        void signIn();
      }
    }
  }, [isUser, options?.redirectTo, status]);

  if (isUser) {
    return children;
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return (
    <div className='h-screen w-screen flex flex-col justify-center content-center items-center'>
      Loading...
    </div>
  );
}

export default WithAuth;
