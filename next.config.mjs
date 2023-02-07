import {createSecureHeaders} from 'next-secure-headers';

const options = {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'long',
};
const lastBuild = new Date(new Date().toUTCString()).toLocaleString(
  'en-US',
  options,
);
const lastBuildIso = new Date().toISOString();

/** @type {import("next").NextConfig} **/
const nextConfig = {
  eslint: {
    dirs: ['src'],
  },

  experimental: {
    fontLoaders: [
      { loader: '@next/font/google', options: { subsets: ['latin'] } },
    ],
  },
  async headers() {
    return [{ source: '/(.*)', headers: createSecureHeaders() }];
  },
  images: { domains: ['avatars.githubusercontent.com'] },
  output: 'standalone',
  poweredByHeader: false,
  publicRuntimeConfig: { lastBuild, lastBuildIso },
  reactStrictMode: true,
  swcMinify: true,
  // SVGR
  webpack(config) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        type: 'asset',
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: /\.[jt]sx?$/,
        resourceQuery: { not: [/url/] }, // exclude react component if *.svg?url
        use: [
          {
            loader: '@svgr/webpack',
            options: { typescript: true, icon: true, },
          },
        ],
      },
    );
    return config;
  },
};

export default nextConfig;
