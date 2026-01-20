import type { Metadata } from 'next';
import ResultsClient from './ResultsClient';

export const metadata: Metadata = {
  title: '実績・判断の記録 - 滋賀県甲賀市のWeb制作実績',
  description: '株式会社DP-GUILDのWeb制作・SNS運用・DX支援の実績一覧。滋賀県甲賀市を中心に、中小企業の課題解決を支援しています。判断プロセスを公開。',
  alternates: {
    canonical: '/results',
  },
  openGraph: {
    title: '実績・判断の記録 - 滋賀県甲賀市のWeb制作実績',
    description: '株式会社DP-GUILDのWeb制作・SNS運用・DX支援の実績一覧。',
    url: 'https://dp-guild.com/results',
  },
};

export default function ResultsPage() {
  return <ResultsClient />;
}
