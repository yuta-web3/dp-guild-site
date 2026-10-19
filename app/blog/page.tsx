import type { Metadata } from 'next';
import { getBlogSummaries } from '@/lib/microcms';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import IsoGrid from '@/components/IsoGrid';
import IsoCube from '@/components/service/IsoCube';
import BlogIndex from '@/components/blog/BlogIndex';
import '../lp-base.css';
import './blog.css';

export const revalidate = 60; // ISR: 60秒ごとに再検証

export const metadata: Metadata = {
  title: 'ブログ｜株式会社DP-GUILD',
  description: 'DX・IT活用、ホームページ・SNS・ネットショップの集客について、中小企業の現場で使える形でまとめています。',
  alternates: { canonical: '/blog' },
};

export default async function BlogPage() {
  const posts = await getBlogSummaries();

  return (
    <div className="lp blog">
      <IsoGrid />
      <SiteHeader here="ブログ" />

      <div className="shell">
        <section className="fv bx-hero">
          <div className="fvtxt">
            <IsoCube />
            <p className="bx-eyebrow">
              <i />
              DP-GUILD ブログ
            </p>
            <h1 className="bx-h1">ブログ</h1>
            <p className="bx-lede">DX・IT活用に関する情報をお届けします</p>
          </div>
        </section>

        <main className="body bx-main">
          <BlogIndex posts={posts} />
        </main>

        <section className="bx-cta">
          <div>
            <p className="k">DXについてお悩みですか？</p>
            <p className="t">まず30分、状況を整理します</p>
          </div>
          <a href="https://timerex.net/s/info_f990_429a/709e9191" target="_blank" rel="noopener noreferrer">
            相談を予約する<span aria-hidden="true">→</span>
          </a>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
