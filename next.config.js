/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    domains: ['storage.googleapis.com', 'pbs.twimg.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://cdn.syndication.twimg.com/:path*',
      },
      {
        source: '/api/:path*',
        destination: 'https://pbs.twimg.com/:path*',
      },
    ];
  },
};

// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA(nextConfig);
