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
      // 旧WordPress パラメータURL対策（重複コンテンツ解消）
      {
        source: '/',
        has: [{ type: 'query', key: 'author' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'm' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'p' }],
        destination: '/',
        permanent: true,
      },
      {
        source: '/',
        has: [{ type: 'query', key: 'page_id' }],
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
