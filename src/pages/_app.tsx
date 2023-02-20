import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect } from 'react';

import '@/styles/globals.scss';

import { AppUser } from '@/lib/types';

import WithAuth from '@/Components/Layout/auth/WithAuth';
import FuturaSpinner from '@/Components/Loaders/FuturaSpinner';
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

// function HandleAppAccess() {
//   const [isOpen, setIsOpen] = useState(true);
//   return (
//     <AppBlurredModal
//       isOpen={isOpen}
//       onClose={() => setIsOpen(true)}
//       title='Early Access'
//     >
//       <Paragraph fontSize='1rem'>
//         This app is currently in early access. It&apos;s not open to the public
//         yet.
//       </Paragraph>
//     </AppBlurredModal>
//   );
// }

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const CustomComponent = Component as typeof Component & { auth?: object };
  return (
    <SessionProvider
      refetchInterval={60}
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
        <FuturaSpinner display='none' semiTransparent />
        {/* <HandleAppAccess /> */}
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
