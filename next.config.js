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
      {
        source: '/ar/spine.html',
        destination: '/ar/spine',
      },
      {
        source: '/ar/spine-fallback.html',
        destination: '/ar/spine-fallback',
      },
      {
        source: '/ar/qr-spine.html',
        destination: '/ar/qr-spine',
      },
      {
        source: '/ar/chloroplast.html',
        destination: '/ar/chloroplast',
      },
      {
        source: '/ar/chloroplast-fallback.html',
        destination: '/ar/chloroplast-fallback',
      },
      {
        source: '/ar/qr-chloroplast.html',
        destination: '/ar/qr-chloroplast',
      },
      {
        source: '/ar/animal-cell.html',
        destination: '/ar/animal-cell',
      },
      {
        source: '/ar/animal-cell-fallback.html',
        destination: '/ar/animal-cell-fallback',
      },
      {
        source: '/ar/qr-animal-cell.html',
        destination: '/ar/qr-animal-cell',
      },
    ];
  },
};

module.exports = nextConfig;
