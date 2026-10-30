import Link from 'next/link';
import { getBlogById, getBlogSummaries, type FAQ, type BlogSummary } from '@/lib/microcms';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import IsoGrid from '@/components/IsoGrid';
import ReadProgress from '@/components/blog/ReadProgress';
import '../../lp-base.css';
import '../blog.css';

// 開かれるたびにその場で作る（今の本番と同じ動き。ブログ一覧と同じ理由）
export const dynamic = 'force-dynamic';

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

// 本文の大見出し（h2）から目次を作る。idが無い見出しには付ける
function withToc(html: string) {
  const toc: { id: string; text: string }[] = [];
  let n = 0;
  const out = html.replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/g, (_m, attrs: string, inner: string) => {
    n += 1;
    const found = /\bid="([^"]+)"/.exec(attrs);
    const id = found ? found[1] : `sec-${n}`;
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (text) toc.push({ id, text });
    return found ? `<h2${attrs}>${inner}</h2>` : `<h2${attrs} id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

// 同じカテゴリの新しい記事3つ。足りなければ新しい記事で埋める
async function related(id: string, categoryId?: string): Promise<BlogSummary[]> {
  try {
    const all = (await getBlogSummaries()).filter((b) => b.id !== id);
    const same = all.filter((b) => categoryId && b.category?.id === categoryId);
    return [...same, ...all.filter((b) => !same.includes(b))].slice(0, 3);
  } catch {
    return [];
  }
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

  const { html, toc } = withToc(blog.content);
  const more = await related(id, blog.category?.id);

  const date = (d: string) =>
    new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

  return (
    <div className="lp blog post">
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

      <IsoGrid />
      <ReadProgress />
      <SiteHeader here="ブログ" hereHref="/blog" />

      <div className="shell">
        <article className="body bx-article">
          {/* パンくず */}
          <nav className="bx-crumb" aria-label="現在地">
            <Link href="/blog">ブログ</Link>
            {blog.category && (
              <>
                <span aria-hidden="true">/</span>
                <Link href={`/blog?category=${blog.category.id}`}>{blog.category.name}</Link>
              </>
            )}
          </nav>

          <h1 className="bx-ttl">{blog.title}</h1>

          <div className="bx-by">
            {blog.category && <span className="bx-tag">{blog.category.name}</span>}
            <time dateTime={blog.publishedAt}>{date(blog.publishedAt)}</time>
            <span className="au">{AUTHOR.name}</span>
          </div>

          {/* TL;DR - 要点ボックス（ガイドライン準拠） */}
          {blog.tldr && (
            <div className="bx-tldr">
              <h2>この記事の要点</h2>
              <ul>
                {blog.tldr.split(/\\n|\n/).filter(Boolean).map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 中盤CTA - シンプルバナー */}
          <div className="bx-midcta">
            <p>SNS・Web・DXのお困りごと、まずは相談してみませんか？</p>
            <a href="https://timerex.net/s/info_f990_429a/709e9191" target="_blank" rel="noopener noreferrer">
              無料相談はこちら<span aria-hidden="true">→</span>
            </a>
          </div>

          {/* 目次（大見出しが3つ以上の記事だけ） */}
          {toc.length >= 3 && (
            <nav className="bx-toc" aria-label="目次">
              <p className="h">目次</p>
              <ol>
                {toc.map((t) => (
                  <li key={t.id}>
                    <a href={`#${t.id}`}>{t.text}</a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Content - ガイドライン準拠のスタイリング */}
          <div className="article-content" dangerouslySetInnerHTML={{ __html: html }} />

          {/* FAQ - ガイドライン準拠（本文の後、CTA前） */}
          {blog.faq && blog.faq.length > 0 && (
            <section className="bx-faq">
              <h2>よくある質問</h2>
              <dl>
                {blog.faq.map((item, index) => (
                  <div key={index}>
                    <dt>
                      <span aria-hidden="true">Q</span>
                      {item.question}
                    </dt>
                    <dd>
                      <span aria-hidden="true">A</span>
                      {item.answer}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* CTA - 強化版 */}
          <div className="bx-endcta">
            <h2>お困りごとはありませんか？</h2>
            <p>
              「何から手をつければいいかわからない」という状態でも大丈夫です。
              <br />
              まずはお気軽にご相談ください。
            </p>
            <div className="bt">
              <a className="pri" href="https://timerex.net/s/info_f990_429a/709e9191" target="_blank" rel="noopener noreferrer">
                無料で相談する（Zoom）
              </a>
              <a className="sec2" href="/contact">
                お問い合わせフォーム
              </a>
            </div>
          </div>

          {more.length > 0 && (
            <section className="bx-rel">
              <h2>
                {blog.category && more.every((b) => b.category?.id === blog.category?.id)
                  ? `「${blog.category.name}」のほかの記事`
                  : 'ほかの記事'}
              </h2>
              <div className="bx-relgrid">
                {more.map((b) => (
                  <Link key={b.id} href={`/blog/${b.id}`} className="bx-relcard">
                    <span className="bx-meta">
                      {b.category && <span className="bx-tag">{b.category.name}</span>}
                      <time dateTime={b.publishedAt}>{date(b.publishedAt)}</time>
                    </span>
                    <span className="bx-title">{b.title}</span>
                    <span className="bx-more">
                      読む<i />
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <p className="bx-back">
            <Link href="/blog">← ブログの一覧へ</Link>
          </p>
        </article>
      </div>

      <SiteFooter />
    </div>
  );
}
