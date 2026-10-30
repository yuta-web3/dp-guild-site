/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'my.spline.design' },
    ],
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
      // 会社概要・実績はトップ（会社案内）にまとめた。転送を2段にしないよう /case も直接トップへ
      { source: '/about', destination: '/', permanent: true },
      { source: '/results', destination: '/', permanent: true },
      { source: '/case', destination: '/', permanent: true },
      { source: '/case/:path*', destination: '/', permanent: true },
      // サービスページの統合（2026-10-01）: Instagram初期構築は単体ページをやめ、SNS運用代行の「立ち上げだけ」プランに統合
      // （仮の instagram-feed も同じ向き先。転送を2段にしない）
      {
        source: '/services/instagram-feed',
        destination: '/services/sns-management',
        permanent: true,
      },
      {
        source: '/services/instagram-launch',
        destination: '/services/sns-management',
        permanent: true,
      },
      {
        source: '/services/instagram-launch-recruit',
        destination: '/services/sns-management-recruit',
        permanent: true,
      },
      // 旧サイトURL対策: /service → /
      {
        source: '/service',
        destination: '/',
        permanent: true,
      },
      {
        source: '/service/:path*',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
