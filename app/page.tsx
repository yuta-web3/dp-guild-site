import type { Metadata } from 'next';
import TopPage from '@/components/top/TopPage';
import { company } from '@/lib/top-cases';
import './lp-base.css';
import './top.css';

// トップページ。
// 来るのは社名かURLを知っている人。その人が「任せて大丈夫か」を確認し、
// そのまま相談できる場所にする。新規を連れてくる仕事は負わせない（記事の役割）。
//
// ファーストビューに並べる相談は lib/top-cases.ts のデータ。
// アンケートの結果が出たら、そこを書き換えるだけで差し替わる。

export const metadata: Metadata = {
  title: '株式会社DP-GUILD｜サイト・SNS・EC・業務システムの制作と改善',
  description:
    '滋賀のWeb制作・DX支援会社。サイトの導線改善、Instagramの立ち上げ、ECの作り直し、在庫管理システムの開発まで。実際にいただいたご相談と、何をしたかを公開しています。',
  alternates: { canonical: '/' },
  openGraph: {
    title: '株式会社DP-GUILD｜サイト・SNS・EC・業務システムの制作と改善',
    description:
      '滋賀のWeb制作・DX支援会社。実際にいただいたご相談と、何をしたかを公開しています。',
    url: '/',
    type: 'website',
  },
};

export default function Page() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: company.name,
    url: 'https://dp-guild.com',
    email: company.email,
    foundingDate: '2019-02-19',
    address: {
      '@type': 'PostalAddress',
      postalCode: company.zip.replace('〒', ''),
      addressRegion: '滋賀県',
      streetAddress: company.address.replace('滋賀県', ''),
      addressCountry: 'JP',
    },
    founder: { '@type': 'Person', name: '石井 勇多' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TopPage />
    </>
  );
}
