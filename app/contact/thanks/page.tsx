import Link from 'next/link';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';

export const metadata: Metadata = {
  title: 'お問い合わせ完了',
  description: 'お問い合わせありがとうございます。',
  robots: {
    index: false,
    follow: false,
  },
};

export default function ContactThanksPage() {
  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen flex flex-col">
      <SiteHeader here="お問い合わせ" />

      {/* Main Content */}
      <main className="pt-32 pb-20 flex-1">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
          <h1 className="text-3xl font-bold text-[#0F172A] mb-6">
            お問い合わせありがとうございます
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            お問い合わせを受け付けました。<br />
            内容を確認の上、1営業日以内にご連絡いたします。
          </p>

          <p className="text-gray-500 text-sm mb-10">
            ※ 自動返信メールをお送りしています。届かない場合は迷惑メールフォルダをご確認ください。
          </p>

          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-[#101522] text-white font-bold hover:bg-[#1e293b] transition-colors"
          >
            トップページへ戻る
          </Link>
        </div>
      </main>

      {/* Footer */}
      <SiteFooter />
    </div>
  );
}
