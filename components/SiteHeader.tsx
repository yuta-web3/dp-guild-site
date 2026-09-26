'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './site-header.css';

// サイト共通ヘッダー。全ページこれ1つを使う。
//
// ナビは並べない。トップは1ページで確認が終わる作りなので、外へ飛ばす理由がない。
// 変わるのは右側だけ：
//   右に相談パネルがあるページ（トップ・サービスページ）→ CTAを出さない
//   パネルが無いページ（記事・法務・会社概要 など）      → 「相談する」を出す
// CTAは同時に見えるのが1つ、という決定に合わせている。

export default function SiteHeader({
  here,
  hereHref,
  cta = false,
  inset = false,
  dark = false,
}: {
  /** 現在地。省略時は会社名 */
  here?: string;
  /** 現在地をリンクにする（記事 → 記事一覧 など） */
  hereHref?: string;
  /** 「相談する」を出すか。右に相談パネルが無いページで true */
  cta?: boolean;
  /** 右に全高パネルがあるページで true。パネルの手前でヘッダーを止める */
  inset?: boolean;
  /** すぐ下が濃い色の面のページで true。一番上にいる間だけ文字を白にする */
  dark?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        el.classList.toggle('stuck', window.scrollY > 20);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const label = here ?? '株式会社DP-GUILD';

  return (
    <header className={`site-hdr${inset ? ' inset' : ''}${dark ? ' ondark' : ''}`} ref={ref}>
      <Link href="/" className="mark">
        <Image src="/images/logo.png" alt="" width={24} height={24} priority />
        <b>DP-GUILD</b>
      </Link>

      {hereHref ? (
        <Link href={hereHref} className="here site-hdr-here">
          {label}
        </Link>
      ) : (
        <span className="here">{label}</span>
      )}

      {cta && (
        <Link href="/contact" className="go">
          相談する
        </Link>
      )}
    </header>
  );
}
