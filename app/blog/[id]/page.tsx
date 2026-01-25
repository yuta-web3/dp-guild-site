import Link from 'next/link';
import { getBlogById, getAllBlogs, type FAQ } from '@/lib/microcms';
import { ArrowLeft, Calendar, User } from 'lucide-react';
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
      alternates: {
        canonical: `/blog/${id}`,
      },
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

// 著者情報（固定）
const AUTHOR = {
  name: '石井 勇多',
  jobTitle: '代表取締役',
  organization: '株式会社DP-GUILD',
};

// Article JSON-LD構造化データ生成
function generateArticleJsonLd(blog: { title: string; description: string; publishedAt: string; updatedAt: string; eyecatch?: { url: string } }, id: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: blog.title,
    description: blog.description,
    image: blog.eyecatch?.url || 'https://dp-guild.com/og-image.png',
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt,
    author: {
      '@type': 'Person',
      name: AUTHOR.name,
      jobTitle: AUTHOR.jobTitle,
      worksFor: {
        '@type': 'Organization',
        name: AUTHOR.organization,
      },
    },
    publisher: {
      '@type': 'Organization',
      name: '株式会社DP-GUILD',
      logo: {
        '@type': 'ImageObject',
        url: 'https://dp-guild.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://dp-guild.com/blog/${id}`,
    },
  };
}

// 静的生成用のパス取得
export const dynamicParams = true;

export async function generateStaticParams() {
  const { contents } = await getAllBlogs();
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
      {/* Article JSON-LD構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(generateArticleJsonLd(blog, id)),
        }}
      />
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

            <Link href="/results" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">実績・事例</Link>
            <Link href="/about" className="text-[#7F7F7F] hover:text-[#0F172A] transition-colors">会社概要</Link>
            <Link href="/blog" className="text-[#0F172A] font-medium">ブログ</Link>
          </nav>
          <a
            href="https://timerex.net/s/info_f990_429a/709e9191"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:flex items-center px-5 py-2 bg-[#0F172A] text-white rounded-md font-medium hover:bg-[#1e293b] transition-colors"
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
            className="inline-flex items-center text-gray-500 hover:text-gray-600 mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            記事一覧に戻る
          </Link>

          {/* Title（H1） */}
          <h1 className="text-3xl md:text-4xl font-bold text-[#0F172A] mb-6 leading-tight">
            {blog.title}
          </h1>

          {/* Category & Date & Author */}
          <div className="flex flex-wrap items-center gap-4 mb-8">
            {blog.category && (
              <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full">
                {blog.category.name}
              </span>
            )}
            <div className="flex items-center text-gray-500 text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(blog.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
            </div>
            <div className="flex items-center text-gray-500 text-sm">
              <User className="w-4 h-4 mr-1" />
              {AUTHOR.name}
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

          {/* 中盤CTA - シンプルバナー */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-700 text-sm md:text-base">
              <span className="mr-2">💡</span>
              SNS・Web・DXのお困りごと、まずは相談してみませんか？
            </p>
            <a
              href="https://timerex.net/s/info_f990_429a/709e9191"
              target="_blank"
              rel="noopener noreferrer"
              className="whitespace-nowrap px-5 py-2 bg-[#0F172A] text-white rounded-md text-sm font-medium hover:bg-[#1e293b] transition-colors"
            >
              無料相談はこちら
            </a>
          </div>

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

          {/* CTA - 強化版 */}
          <div className="mt-16 bg-[#0F172A] text-white p-8 md:p-10 rounded-xl">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-center">
              お困りごとはありませんか？
            </h2>
            <p className="text-gray-300 text-center mb-8 text-sm md:text-base">
              「何から手をつければいいかわからない」という状態でも大丈夫です。<br className="hidden md:block" />
              まずはお気軽にご相談ください。
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <a
                href="https://timerex.net/s/info_f990_429a/709e9191"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0F172A] rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors"
              >
                無料で相談する（Zoom）
              </a>
              <a
                href="/contact"
                className="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-white rounded-lg font-bold text-lg hover:bg-white hover:text-[#0F172A] transition-colors"
              >
                お問い合わせフォーム
              </a>
            </div>
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
