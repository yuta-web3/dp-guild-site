import Link from 'next/link';
import { getBlogById, getBlogs, type FAQ } from '@/lib/microcms';
import { ArrowLeft, Calendar } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const revalidate = 60;

// メタデータ生成（aio_answerをmeta tagに含める）
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  try {
    const blog = await getBlogById(id);
    return {
      title: blog.title,
      description: blog.description || blog.aio_answer,
      openGraph: {
        title: blog.title,
        description: blog.description || blog.aio_answer,
        images: blog.eyecatch ? [blog.eyecatch.url] : [],
      },
      other: blog.aio_answer ? { 'aio-answer': blog.aio_answer } : {},
    };
  } catch {
    return { title: 'ブログ' };
  }
}

// FAQ JSON-LD構造化データ生成
function generateFAQJsonLd(faq: FAQ[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// 静的生成用のパス取得
export async function generateStaticParams() {
  const { contents } = await getBlogs(100);
  return contents.map((blog) => ({
    id: blog.id,
  }));
}

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { id } = await params;

  let blog;
  try {
    blog = await getBlogById(id);
  } catch {
    notFound();
  }

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      {/* FAQ JSON-LD構造化データ */}
      {blog.faq && blog.faq.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(generateFAQJsonLd(blog.faq)),
          }}
        />
      )}

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-sm py-5 border-b border-gray-100">
        <div className="container mx-auto px-4 md:px-8 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-[#0F172A]">
            DP-GUILD
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/#solutions" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">ソリューション</Link>
            <Link href="/results" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">実績・事例</Link>
            <Link href="/about" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">会社概要</Link>
            <Link href="/blog" className="text-[#0F172A] font-medium">ブログ</Link>
          </nav>
          <a
            href="https://timerex.net/s/info_f990_429a/709e9191"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center px-5 py-2 bg-cyan-500 text-white rounded-md font-medium hover:bg-cyan-600 transition-colors"
          >
            相談する
          </a>
        </div>
      </header>

      {/* Article */}
      <article className="pt-28 pb-16">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center text-gray-500 hover:text-cyan-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            記事一覧に戻る
          </Link>

          {/* Title（H1） */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Category & Date */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {blog.category && (
              <span className="px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full">
                {blog.category.name}
              </span>
            )}
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(blog.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
            </div>
          </div>

          {/* TL;DR - 要点ボックス（ガイドライン準拠） */}
          {blog.tldr && (
            <div className="bg-[#e8f4fd] border border-[#b8daff] rounded-lg p-6 mb-12">
              <h2 className="text-lg font-bold text-[#004085] mb-4">この記事の要点</h2>
              <ul className="space-y-3 pl-5 list-disc marker:text-[#004085]">
                {blog.tldr.split(/\\n|\n/).filter(Boolean).map((line, i) => (
                  <li key={i} className="text-gray-700 leading-relaxed text-[15px]">{line.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Content - ガイドライン準拠のスタイリング */}
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />

          {/* FAQ - ガイドライン準拠（本文の後、CTA前） */}
          {blog.faq && blog.faq.length > 0 && (
            <section className="mt-20 pt-10 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-[#0F172A] mb-8">よくある質問</h2>
              <div className="space-y-6">
                {blog.faq.map((item, index) => (
                  <div key={index} className="border-b border-gray-100 pb-6 last:border-b-0">
                    <h3 className="text-lg font-bold text-[#0F172A] mb-3">
                      Q. {item.question}
                    </h3>
                    <p className="text-gray-700 leading-relaxed pl-6">
                      A. {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* CTA - 2択（Zoom + 問い合わせフォーム） */}
          <div className="mt-16 bg-[#f8f9fa] border-l-4 border-cyan-500 p-6 rounded-r-lg">
            <p className="text-gray-700 leading-relaxed text-[15px]">
              ご自身の状況に当てはまるか判断に迷う場合や、より詳しい情報が必要な場合は
              <a
                href="https://timerex.net/s/info_f990_429a/709e9191"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cyan-600 font-bold hover:underline mx-1"
              >
                相談する（Zoom）
              </a>
              をご利用ください。Zoomが難しい方は
              <a
                href="/contact"
                className="text-cyan-600 font-bold hover:underline mx-1"
              >
                お問い合わせフォーム
              </a>
              からご連絡ください。
            </p>
          </div>
        </div>
      </article>

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
