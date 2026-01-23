import Link from 'next/link';
import type { Metadata } from 'next';

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
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-5 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#0F172A]">
            DP-GUILD
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/results" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">実績・事例</Link>
            <Link href="/about" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">会社概要</Link>
            <Link href="/blog" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">ブログ</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-20">
        <div className="container mx-auto px-4 md:px-8 max-w-2xl text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 mx-auto mb-8 bg-green-100 rounded-full flex items-center justify-center">
            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h1 className="text-3xl font-bold text-[#0F172A] mb-6">
            お問い合わせありがとうございます
          </h1>

          <p className="text-gray-600 mb-4 leading-relaxed">
            お問い合わせを受け付けました。<br />
            内容を確認の上、2営業日以内にご連絡いたします。
          </p>

          <p className="text-gray-500 text-sm mb-10">
            ※ 自動返信メールをお送りしています。届かない場合は迷惑メールフォルダをご確認ください。
          </p>

          <Link
            href="/"
            className="inline-flex items-center px-8 py-3 bg-[#0F172A] text-white rounded-md font-medium hover:bg-[#1e293b] transition-colors"
          >
            トップページへ戻る
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#0F172A] text-white py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold">DP-GUILD</span>
            </div>
            <nav className="flex space-x-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
              <Link href="/about" className="hover:text-white transition-colors">会社概要</Link>
              <Link href="/results" className="hover:text-white transition-colors">実績・事例</Link>
              <Link href="/blog" className="hover:text-white transition-colors">ブログ</Link>
              <Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DP-GUILD Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
