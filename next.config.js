/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const nextConfig = {
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

module.exports = nextConfig;
