import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  i18n: {
    locales: ['es-CO', 'en-US'],
    defaultLocale: 'es-CO',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.ctfassets.net',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'assets.ctfassets.net',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
