'use client';

import { createContext, useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import './site-footer.css';

// サイトの案内（ヘッダー・フッター共通）。
//
// サービスの一覧は app/layout.tsx が lib/services から作って渡す（serviceSlugs と label。手で並べない）。
// ここで lib/services を直接読まないのは、サービス7本ぶんの文言（約170KB）が
// 全ページのブラウザ側のJSに入ってしまうため。layout から渡せば、名前とURLだけが届く。
//
// 1ページ1ゴール（2026-10-03 代表）：本文の中で他ページへのクリックを促さない。
// サイトにあるページは、ヘッダーとフッターで普通に案内する。

export type NavItem = { href: string; label: string };

const NavContext = createContext<NavItem[]>([]);

export function SiteNavProvider({ services, children }: { services: NavItem[]; children: React.ReactNode }) {
  return <NavContext.Provider value={services}>{children}</NavContext.Provider>;
}

/** サービスページの一覧（ヘッダー・フッター用） */
export function useServiceNav() {
  return useContext(NavContext);
}

export const companyNav: NavItem = { href: '/', label: '会社案内' };
export const contactNav: NavItem = { href: '/contact', label: 'お問い合わせ' };
/** 法務3ページ。決済の審査で見られるので、フッターから消さない */
export const legalNav: NavItem[] = [
  { href: '/terms', label: '利用規約' },
  { href: '/tokushoho', label: '特定商取引法に基づく表記' },
  { href: '/privacy', label: 'プライバシーポリシー' },
];

/** フッターの案内。濃い色の面の上に置く前提（.lp の lpfoot・法務ページのフッター）。
 *  only="services"：サービスの一覧だけを出す（法務ページ。会社・法務のリンクは LegalLayout 側に既にある。
 *  LegalLayout は main 側が正なので、差し込みは1行にとどめている） */
export function SiteFooterNav({ only }: { only?: 'services' } = {}) {
  const services = useServiceNav();
  const path = usePathname();
  const cur = (href: string) => (path === href ? ('page' as const) : undefined);

  return (
    <div className={`site-fnav${only ? ' only' : ''}`}>
      <nav aria-label="サイトの案内" className="fn-main">
        {services.length > 0 && (
          <div className="fn-grp fn-svc">
            <p className="fn-h">サービス</p>
            <ul>
              {services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} aria-current={cur(s.href)}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        {!only && (
          <div className="fn-grp">
            <p className="fn-h">会社</p>
            <ul>
              {[companyNav, contactNav].map((s) => (
                <li key={s.href}>
                  <Link href={s.href} aria-current={cur(s.href)}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </nav>
      {!only && (
        <nav aria-label="規約など" className="fn-legal">
          {legalNav.map((s) => (
            <Link key={s.href} href={s.href} aria-current={cur(s.href)}>
              {s.label}
            </Link>
          ))}
        </nav>
      )}
    </div>
  );
}
