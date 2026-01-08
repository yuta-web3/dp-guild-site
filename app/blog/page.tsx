import Link from 'next/link';
import { getBlogs } from '@/lib/microcms';
import { ArrowRight, Calendar } from 'lucide-react';
import Header from '@/components/Header';

export const revalidate = 60; // ISR: 60秒ごとに再検証

export default async function BlogPage() {
  const { contents: blogs, totalCount } = await getBlogs(20);

  return (
    <div className="font-sans text-gray-900 bg-white min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155]">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">ブログ</h1>
          <p className="text-xl text-gray-300">
            DX・IT活用に関する情報をお届けします
          </p>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-16">
        <div className="container mx-auto px-4 md:px-8">
          {blogs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">記事がまだありません</p>
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-8">{totalCount}件の記事</p>
              <div className="flex flex-col gap-6">
                {blogs.map((blog) => (
                  <Link
                    key={blog.id}
                    href={`/blog/${blog.id}`}
                    className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all p-6"
                  >
                    {blog.category && (
                      <span className="inline-block px-3 py-1 bg-cyan-100 text-cyan-700 text-sm rounded-full mb-3">
                        {blog.category.name}
                      </span>
                    )}
                    <h2 className="text-xl font-bold text-[#0F172A] mb-3 group-hover:text-cyan-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h2>
                    {blog.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {blog.description}
                      </p>
                    )}
                    <div className="flex items-center text-gray-400 text-sm">
                      <Calendar className="w-4 h-4 mr-1" />
                      {new Date(blog.publishedAt).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.')}
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-r from-cyan-500 to-blue-600">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            DXについてお悩みですか？
          </h2>
          <p className="text-white/90 mb-8">
            まず30分、状況を整理します
          </p>
          <a
            href="https://timerex.net/s/info_f990_429a/709e9191"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-white text-[#0F172A] rounded-md font-medium hover:bg-gray-100 transition-colors"
          >
            相談を予約する
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

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
