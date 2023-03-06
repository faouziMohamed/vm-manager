import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { SessionProvider } from 'next-auth/react';

import '@/styles/globals.scss';

import WithAuth from '@/Components/Layout/auth/WithAuth';
import Theme from '@/styles/theme';

const theme = extendTheme(Theme);
export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const CustomComponent = Component as typeof Component & { auth?: object };
  return (
    <SessionProvider
      refetchInterval={15}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      session={session}
      refetchOnWindowFocus
    >
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
            <WithAuth>
              {/* eslint-disable-next-line react/jsx-props-no-spreading */}
              <CustomComponent {...pageProps} />
            </WithAuth>
          ) : (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <CustomComponent {...pageProps} />
          )}
        </Box>
      </ChakraProvider>
    </SessionProvider>
  );
}
