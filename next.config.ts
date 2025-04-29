/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://119.59.118.75:8100/api/:path*',
      },
    ];
  },
};

export default nextConfig;
