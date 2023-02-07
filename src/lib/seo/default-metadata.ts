/* eslint-disable @typescript-eslint/restrict-template-expressions */

// export interface ISeoProps {
//   title?: string;
//   siteName?: string;
//   description?: string;
//   url?: string;
//   type?: string;
//   robots?: string;
//   image?: string;
//   keywords?: string;
//   tags?: string;
//   date?: string;
// }

export const keywords = [
  'Android x86',
  'Virtual Machine',
  'Cloud computing',
  'Open-source',
  'PC compatibility',
  'Operating system porting',
  'Mobile device simulation',
  'Android on PC',
  'Emulation technology',
];

export const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
export const metadata = {
  siteUrl,
  title: 'Run and Manage Android x86 Virtual Machine on the Cloud',
  description:
    'Android x86 is an open-source project that aims to port Android to the x86 platform, allowing you to run Android on your PC.',
  siteName: 'CSentinel',
  keywords: keywords.join(', '),
  type: 'website',
  robots: 'follow, index',
  date: new Date().toString(),
};

export const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  url: metadata.siteUrl,
  name: metadata.title,
  description: metadata.description,
  keywords: metadata.keywords,
  robots: metadata.robots,
  datePublished: metadata.date,
  author: {
    '@type': 'Organization',
    name: metadata.siteName,
  },
  about: {
    '@type': 'WebApplication',
    operatingSystem: 'Android x86',
    applicationCategory: 'Virtual Machine',
    availableOn: 'Cloud',
  },
  mainEntityOfPage: {
    '@type': 'WebPage',
    '@id': metadata.siteUrl,
  },
};

export function getDefaultJsonLd() {
  return JSON.stringify(jsonLd);
}
