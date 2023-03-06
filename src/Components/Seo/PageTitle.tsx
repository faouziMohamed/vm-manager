import Head from 'next/head';

export default function PageTitle({ title }: { title: string }) {
  const appName = process.env.NEXT_PUBLIC_APP_NAME!;
  return (
    <Head>
      <title>{`${title} | ${appName}`}</title>
      <meta name='twitter:Name' content={title} />
      <meta property='og:Name' content={title} />
    </Head>
  );
}
