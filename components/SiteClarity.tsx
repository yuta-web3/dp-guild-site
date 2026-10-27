'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

// Microsoft Clarity（サイト用のプロジェクト。2026-10-27 代表）
// 目的：来た人がなぜ資料請求しないか・どこでやめるかを知り、ページを直すため。
// LP（/lp/...）は広告の検証用に別のプロジェクトで計っているので、ここでは読まない（数字を混ぜない）。
// サイトから LP へのリンクは無い（LP には広告・DM から直接来る）。
export default function SiteClarity() {
  const pathname = usePathname();
  if (pathname?.startsWith('/lp/')) return null;
  return (
    <Script id="ms-clarity-site" strategy="afterInteractive">
      {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","z4567ho7s2");`}
    </Script>
  );
}
