import type { Metadata } from 'next';
import AboutClient from './AboutClient';

export const metadata: Metadata = {
  title: '会社概要 - 滋賀県甲賀市のWeb制作・DX支援会社',
  description: '株式会社DP-GUILDは滋賀県甲賀市を拠点に、中小企業のWeb制作・SNS運用・DX支援を行っています。「何から手をつけるか」を一緒に決める会社。',
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: '会社概要 - 滋賀県甲賀市のWeb制作・DX支援会社',
    description: '株式会社DP-GUILDは滋賀県甲賀市を拠点に、中小企業のWeb制作・SNS運用・DX支援を行っています。',
    url: 'https://dp-guild.com/about',
  },
};

export default function AboutPage() {
  return <AboutClient />;
}
