import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";

// 法務系ページ（利用規約・特商法・プラポリ）共通レイアウト
//
// 2026-09-06: 内容が確定したため、既定を「公開表示」に反転。
//   再びドラフト表示に戻したいときだけ NEXT_PUBLIC_LEGAL_DRAFT=true を設定する。
//   （バナー・要確認ハイライト・noindex が一括で戻る）
export const LEGAL_DRAFT = process.env.NEXT_PUBLIC_LEGAL_DRAFT === "true";

export const legalRobots = LEGAL_DRAFT
  ? { index: false, follow: false }
  : { index: true, follow: true };

export default function LegalLayout({
  title,
  titleEn,
  updatedAt,
  children,
}: {
  title: string;
  titleEn: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="font-sans text-gray-900 bg-white">
      <SiteHeader here={title} cta />

      {LEGAL_DRAFT && (
        <div className="pt-20">
          <div className="max-w-3xl mx-auto px-5 md:px-8 mt-6">
            <div className="bg-amber-50 border border-amber-300 rounded-lg px-4 py-3 text-sm text-amber-800">
              <strong>【内部確認用ドラフト】</strong>
              このページは未公開のドラフトです。黄色の「要確認」箇所の確定後、
              NEXT_PUBLIC_LEGAL_DRAFT=false で公開表示に切り替わります。
            </div>
          </div>
        </div>
      )}

      {/* タイトル */}
      <section className={`${LEGAL_DRAFT ? "pt-10" : "pt-32"} pb-10 md:pb-14 px-5 md:px-8`}>
        <div className="max-w-3xl mx-auto">
          <p className="text-xs md:text-sm text-gray-400 tracking-widest uppercase mb-3 md:mb-4">
            {titleEn}
          </p>
          <h1 className="text-2xl md:text-4xl font-bold text-[#0F172A] leading-snug">
            {title}
          </h1>
          {updatedAt ? (
            <p className="text-sm text-gray-500 mt-4">{updatedAt}</p>
          ) : (
            LEGAL_DRAFT && (
              <p className="text-sm mt-4">
                <Pending>制定日は未確定（公開時にページ内で設定する）</Pending>
              </p>
            )
          )}
        </div>
      </section>

      {/* 本文 */}
      <section className="pb-16 md:pb-24 px-5 md:px-8">
        <div className="max-w-3xl mx-auto article-content">{children}</div>
      </section>

      {/* フッター（シンプル形式） */}
      <footer className="bg-[#0F172A] py-10 md:py-12">
        <div className="max-w-6xl mx-auto px-5 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="text-xl font-bold text-white">DP-GUILD</div>
            <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">ホーム</Link>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">会社概要</Link>
              <Link href="/results" className="text-gray-300 hover:text-white transition-colors">実績・事例</Link>
              <Link href="/blog" className="text-gray-300 hover:text-white transition-colors">ブログ</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">お問い合わせ</Link>
            </nav>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs mt-6">
            <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">利用規約</Link>
            <Link href="/tokushoho" className="text-gray-400 hover:text-white transition-colors">特定商取引法に基づく表記</Link>
            <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">プライバシーポリシー</Link>
          </div>
          <div className="border-t border-gray-800 pt-6 mt-6">
            <p className="text-center text-gray-500 text-xs md:text-sm">
              &copy; 2025 DP-GUILD. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// 未確定箇所の注記。ドラフト表示中だけ黄色ハイライトで表示され、
// 公開表示（NEXT_PUBLIC_LEGAL_DRAFT=false）では何も出力しない。
// ※本文の一部をここに入れないこと（注記専用。消えても文が成立する使い方のみ）
export function Pending({ children }: { children: React.ReactNode }) {
  if (!LEGAL_DRAFT) return null;
  return (
    <mark className="bg-amber-100 text-amber-900 rounded px-1 py-0.5 text-[0.95em]">
      要確認: {children}
    </mark>
  );
}
