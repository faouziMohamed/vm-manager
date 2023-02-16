import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import '@/styles/globals.scss';

import { AppUser } from '@/lib/types';

import WithAuth from '@/Components/Layout/auth/WithAuth';
import Theme from '@/styles/theme';

const theme = extendTheme(Theme);

function RenderComponents({ children }: { children: JSX.Element }) {
  const router = useRouter();
  const { data: session } = useSession();
  useEffect(() => {
    const user = session?.user as AppUser;
    if (user?.emailVerified === false && router.asPath !== '/verify-email') {
      void router.push('/verify-email');
    }
  }, [router, session?.user]);
  return children;
}

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const CustomComponent = Component as typeof Component & { auth?: object };
  return (
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    <SessionProvider session={session} refetchInterval={2 * 60}>
      <ChakraProvider theme={theme}>
        <Head>
          <meta
            name='viewport'
            content='width=device-width, initial-scale=1.0'
          />
          <title>Android Server Manager</title>
        </Head>
        <Box
          className={Theme.fonts.variables.join(' ')}
          fontFamily={`var(${Theme.fonts.ubuntu.variable})`}
        >
          {CustomComponent.auth ? (
            <RenderComponents>
              <WithAuth>
                {/* eslint-disable-next-line react/jsx-props-no-spreading */}
                <CustomComponent {...pageProps} />
              </WithAuth>
            </RenderComponents>
          ) : (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <CustomComponent {...pageProps} />
          )}
        </Box>
      </ChakraProvider>
    </SessionProvider>
  );
}
