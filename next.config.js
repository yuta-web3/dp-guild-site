/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com', 'my.spline.design'],
    unoptimized: true,
  },
  async redirects() {
    return [
      // カニバリ対策: snsunyouhiyou01 → snsoutsourcecost01
      {
        source: '/blog/snsunyouhiyou01',
        destination: '/blog/snsoutsourcecost01',
        permanent: true,
      },
      // 旧サイトURL対策
      {
        source: '/case/:path*',
        destination: '/results',
        permanent: true,
      },
      {
        source: '/service',
        destination: '/',
        permanent: true,
      },
      
    ];
  },
};

module.exports = nextConfig;
