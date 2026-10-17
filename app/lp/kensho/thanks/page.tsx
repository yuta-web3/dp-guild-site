import type { Metadata } from 'next';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import '../../../lp-base.css';
import '../kensho.css';

// 検証パッケージLP の送信完了画面。
// UTM はクエリで引き継がれて来る（計測用）。表示は簡潔に。動かさない。

export const metadata: Metadata = {
  title: '送信しました｜検証パッケージの無料相談',
  description: 'ご相談を受け付けました。2営業日以内に、メールでご連絡します。',
  robots: { index: false, follow: false },
};

export default function KenshoThanksPage() {
  return (
    <div className="lp kensho boot">
      <SiteHeader here="検証パッケージ" />

      <main className="k-wrap k-thanks">
        <h1>送信しました。</h1>
        <p>2営業日以内に、ご入力のメールアドレス宛にご連絡します。</p>
        <p>自動返信メールをお送りしています。届かない場合は、迷惑メールフォルダをご確認ください。</p>
        <p>返信までの間、Instagramで試している投稿をご覧ください。どれも、このページで書いたやり方で出しています。</p>
        {/* 自社アカウントが決まったら href を Instagram のURLに変える */}
        <Link href="/" className="k-back">
          株式会社DP-GUILD のサイトへ
        </Link>
      </main>

      <footer className="k-foot">
        <div className="k-wrap">
          <nav aria-label="法的情報">
            <Link href="/tokushoho">特定商取引法に基づく表記</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
            <Link href="/terms">利用規約</Link>
          </nav>
          <p className="k-co">運営会社：株式会社DP-GUILD</p>
          <p className="k-cp">&copy; {new Date().getFullYear()} DP-GUILD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
