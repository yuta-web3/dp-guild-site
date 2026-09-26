import type { Metadata } from 'next';
import KenshoPage from '@/components/lp/KenshoPage';
import '../../lp-base.css';
import './kensho.css';

// 検証パッケージの無料相談LP。Instagram の投稿からの着地先。
// 試運転の間は noindex（検索流入を混ぜず、Instagram 経由だけで数字を見る）。
// 確認用URL：/lp/kensho?utm_source=dm&utm_content=p001 ／ /lp/kensho?utm_source=profile

const TITLE = '出す前に、確かめる。検証パッケージの無料相談';
const DESC =
  '出す前に、効くかどうかを確かめる。反応が出た投稿だけを広告にする。それが、私たちのやり方です。';
const URL = 'https://dp-guild.com/lp/kensho';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  robots: { index: false, follow: false },
  alternates: { canonical: URL },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: URL,
    siteName: 'DP-GUILD',
    locale: 'ja_JP',
    type: 'website',
    images: [{ url: 'https://dp-guild.com/og-image.png', width: 1200, height: 630, alt: 'DP-GUILD' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESC,
    images: ['https://dp-guild.com/og-image.png'],
  },
};

export default function Page() {
  return <KenshoPage />;
}
