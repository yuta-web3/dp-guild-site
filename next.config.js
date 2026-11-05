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
      // カニバリ対策（2026-11-04）: ほぼ同じ題名の hpcompany01 → hpcorporate01（表示と順位が上の方に寄せる）
      {
        source: '/blog/hpcompany01',
        destination: '/blog/hpcorporate01',
        permanent: true,
      },
      // カニバリ対策（2026-11-04）: ほぼ同じ中身で料金の数字が残る adagencycost01 → adsagencycost01（直した方に寄せる）
      {
        source: '/blog/adagencycost01',
        destination: '/blog/adsagencycost01',
        permanent: true,
      },
      // 2026-11-05 石井さんの了承: 新規の受付が終わった事業再構築補助金の記事 → 後継の新事業進出・ものづくり商業サービス補助金の記事
      {
        source: '/blog/jigyosaikochiku01',
        destination: '/blog/monozukuri01',
        permanent: true,
      },
      // 2026-11-05 石井さんの了承: 主題が同じ hpsmartphone01 → hpmobile01
      {
        source: '/blog/hpsmartphone01',
        destination: '/blog/hpmobile01',
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
