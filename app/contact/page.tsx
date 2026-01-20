import type { Metadata } from 'next';
import ContactClient from './ContactClient';

export const metadata: Metadata = {
  title: 'お問い合わせ - DP-GUILD',
  description: '株式会社DP-GUILDへのお問い合わせはこちら。Web制作・SNS運用・DX支援のご相談を承っています。滋賀県甲賀市を拠点に中小企業を支援。',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'お問い合わせ - DP-GUILD',
    description: '株式会社DP-GUILDへのお問い合わせはこちら。Web制作・SNS運用・DX支援のご相談を承っています。',
    url: 'https://dp-guild.com/contact',
  },
};

export default function ContactPage() {
  return <ContactClient />;
}
