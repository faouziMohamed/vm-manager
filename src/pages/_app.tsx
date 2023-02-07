import { Box, ChakraProvider, extendTheme } from '@chakra-ui/react';
import type { AppProps } from 'next/app';
import Head from 'next/head';

import '@/styles/globals.scss';

import Theme from '@/styles/theme';

const theme = extendTheme(Theme);
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1.0' />
        <title>Android Server Manager</title>
      </Head>
      <Box
        className={Theme.fonts.variables.join(' ')}
        fontFamily={`var(${Theme.fonts.ubuntu.variable})`}
      >
        {/* eslint-disable-next-line react/jsx-props-no-spreading */}
        <Component {...pageProps} />
      </Box>
    </ChakraProvider>
  );
}
