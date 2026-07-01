/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/ar/heart.html',
        destination: '/ar/heart',
      },
      {
        source: '/ar/heart-fallback.html',
        destination: '/ar/heart-fallback',
      },
      {
        source: '/ar/qr-heart.html',
        destination: '/ar/qr-heart',
      },
    ];
  },
};

module.exports = nextConfig;
