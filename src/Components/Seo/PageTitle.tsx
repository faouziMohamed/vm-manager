import Head from 'next/head';

export default function PageTitle({ title }: { title: string }) {
  return (
    <Head>
      <title>
        {title} {' | '} {process.env.NEXT_PUBLIC_APP_NAME}
      </title>
      <meta name='twitter:Name' content={title} />
      <meta property='og:Name' content={title} />
    </Head>
  );
}
