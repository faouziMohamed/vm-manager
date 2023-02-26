import getConfig from 'next/config';
import { Head, Html, Main, NextScript } from 'next/document';

import { getDefaultJsonLd, metadata } from '@/lib/seo/default-metadata';

import Theme from '@/styles/theme';
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { publicRuntimeConfig } = getConfig();
// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const { lastBuildIso }: { lastBuildIso: string } = publicRuntimeConfig;

export default function Document() {
  return (
    <Html lang='en' className='scroll-smooth'>
      <Head>
        <meta charSet='UTF-8' />
        <meta name='robots' content={metadata.robots} key='robots' />
        <meta content={metadata.description} name='description' key='desc' />
        <meta httpEquiv='X-UA-Compatible' content='IE=edge' />
        <meta name='classification' content='business' key='classification' />
        <meta name='copyright' content='CSentinel' key='copyright' />
        <meta name='url' content={metadata.siteUrl} key='url' />
        <meta
          name='site_map'
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          content={`${process.env.NEXT_PUBLIC_SITE_URL}/sitemap.xml`}
          key='site_map'
        />
        <meta property='og:type' content={metadata.type} key='og:type' />
        <meta
          property='og:site_name'
          content={metadata.siteName}
          key='og:site_name'
        />
        <meta
          property='og:description'
          content={metadata.description}
          key='og:description'
        />
        <meta
          property='og:descriptions'
          content={metadata.description}
          key='og:descriptions'
        />
        <meta property='og:title' content={metadata.title} key='og:title' />
        {/* <meta name='image' property='og:image' content={image} key='og:image' /> */}

        <meta
          name='twitter:card'
          content='summary_large_image'
          key='twitter:card'
        />
        {/* <meta name='twitter:site' content='@MagicalRavers' key='twitter:site' /> */}
        {/* <meta name='twitter:image' content={image} key='twitter:image' /> */}
        <meta
          name='msapplication-TileColor'
          content={Theme.colors.tertiary.main}
          key='msapplication-TileColor'
        />
        <meta
          name='apple-mobile-web-app-title'
          content={process.env.NEXT_PUBLIC_SITE_NAME}
        />
        <meta
          name='application-name'
          content={process.env.NEXT_PUBLIC_SITE_NAME}
        />

        <meta
          name='msapplication-TileColor'
          content={Theme.colors.primary.main}
          key='msapplication-TileColor'
        />
        <meta name='theme-color' content={Theme.colors.primary.main} />

        <meta
          name='apple-mobile-web-app-status-bar-style'
          content={Theme.colors.primary.main}
        />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-touch-fullscreen' content='yes' />

        {lastBuildIso && <meta name='og:updated_time' content={lastBuildIso} />}
        <meta name='og:locale' content='en_US' />
        <meta name='og:locale:alternate' content='en_US' />
        <meta name='og:locale:alternate' content='en_GB' />

        <script
          type='application/ld+json'
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: getDefaultJsonLd() }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
