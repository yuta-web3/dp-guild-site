'use client';

import { useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useServiceNav, companyNav, contactNav } from '@/components/SiteNav';
import './site-header.css';

// サイト共通ヘッダー。全ページこれ1つを使う。
//
// 案内（2026-10-03 代表）：サービス（lib/services から自動）・会社案内（/）・お問い合わせ（/contact）。
//   PC：「サービス」を押すと一覧が下に開く。会社案内・お問い合わせは文字のリンク
//   スマホ（760px以下）：「メニュー」を押すと、サービス一覧・会社案内・お問い合わせが開く
//   案内は控えめな文字にする。資料請求パネル（右端の .rail）がいちばん目立つ、を崩さない
//
// 右側のボタン：
//   右に資料請求パネルがあるページ（トップ・サービスページ）→ ボタンを出さない（お問い合わせは文字のリンク）
//   パネルが無いページ（記事・法務・会社概要 など）          → 「相談する」ボタンを出す（/contact）
// ボタンは同時に見えるのが1つ、という決定に合わせている。

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
  const svcBtn = useRef<HTMLButtonElement>(null);
  const menuBtn = useRef<HTMLButtonElement>(null);
  // 開いているもの：PCのサービス一覧（svc）／スマホのメニュー（menu）
  const [open, setOpen] = useState<null | 'svc' | 'menu'>(null);
  const services = useServiceNav();
  const path = usePathname();
  const svcId = useId();
  const menuId = useId();

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

  // ページが変わったら閉じる
  useEffect(() => setOpen(null), [path]);

  // Esc で閉じて、押したボタンに戻る／外を押したら閉じる
  useEffect(() => {
    if (!open) return;
    const btn = open === 'svc' ? svcBtn.current : menuBtn.current;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(null);
      btn?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    // 画面の幅が変わって、開いているほうのボタンが隠れたら閉じる
    const onResize = () => {
      if (btn && btn.offsetParent === null) setOpen(null);
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onDown);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onDown);
      window.removeEventListener('resize', onResize);
    };
  }, [open]);

  // キーボードで一覧の外へ出たら閉じる（Tab で抜けたとき）
  const onBlurWithin = (e: React.FocusEvent) => {
    if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setOpen(null);
  };

  const cur = (href: string) => (path === href ? ('page' as const) : undefined);
  const label = here ?? '株式会社DP-GUILD';
  const onService = services.some((s) => s.href === path);

  return (
    <header
      className={`site-hdr${inset ? ' inset' : ''}${dark ? ' ondark' : ''}${open ? ' open' : ''}`}
      ref={ref}
    >
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

      {/* PC の案内 */}
      <nav className="nav" aria-label="サイトの案内">
        {services.length > 0 && (
          <div className="dd" onBlur={onBlurWithin}>
            <button
              type="button"
              ref={svcBtn}
              className={`ln${onService ? ' cur' : ''}`}
              aria-expanded={open === 'svc'}
              aria-controls={svcId}
              onClick={() => setOpen(open === 'svc' ? null : 'svc')}
            >
              サービス
              <i className="car" aria-hidden="true" />
            </button>
            <ul className="ddl" id={svcId} hidden={open !== 'svc'}>
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} aria-current={cur(s.href)} onClick={() => setOpen(null)}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Link href={companyNav.href} className="ln" aria-current={cur(companyNav.href)}>
          {companyNav.label}
        </Link>
        {!cta && (
          <Link href={contactNav.href} className="ln" aria-current={cur(contactNav.href)}>
            {contactNav.label}
          </Link>
        )}
      </nav>

      {cta && (
        <Link href={contactNav.href} className="go">
          相談する
        </Link>
      )}

      {/* スマホの案内 */}
      <div className="mm" onBlur={onBlurWithin}>
        <button
          type="button"
          ref={menuBtn}
          className="mmb"
          aria-expanded={open === 'menu'}
          aria-controls={menuId}
          onClick={() => setOpen(open === 'menu' ? null : 'menu')}
        >
          <span className="bars" aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
          {open === 'menu' ? '閉じる' : 'メニュー'}
        </button>
        <nav className="mmp" id={menuId} aria-label="サイトの案内" hidden={open !== 'menu'}>
          {services.length > 0 && (
            <>
              <p className="mmh">サービス</p>
              <ul>
                {services.map((s) => (
                  <li key={s.href}>
                    <Link href={s.href} aria-current={cur(s.href)} onClick={() => setOpen(null)}>
                      {s.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </>
          )}
          <p className="mmh">会社</p>
          <ul>
            {[companyNav, contactNav].map((s) => (
              <li key={s.href}>
                <Link href={s.href} aria-current={cur(s.href)} onClick={() => setOpen(null)}>
                  {s.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
