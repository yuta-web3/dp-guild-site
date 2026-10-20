import type { Metadata } from 'next';
import Link from 'next/link';
import LpHeader from '../_parts/LpHeader';
import '../lp-base.css';
import '../kensho.css';

// 検証パッケージLP の送信完了画面。
// UTM はクエリで引き継がれて来る（計測用）。表示は簡潔に。動かさない。

export const metadata: Metadata = {
  title: '資料をお送りしました｜検証パッケージ',
  description: 'ご入力のメールアドレスに、検証パッケージの資料をお送りしました。',
  robots: { index: false, follow: false },
};

export default function KenshoThanksPage() {
  return (
    <div className="lpk kensho boot">
      <LpHeader here="検証パッケージ" />

      <main className="k-wrap k-thanks">
        <h1>資料をお送りしました。</h1>
        <p>ご入力のメールアドレスに、資料のリンクをお送りしました。届かない場合は、迷惑メールフォルダをご確認ください。</p>
        <p>ご相談は、そのメールにご返信ください。1営業日以内にお答えします。</p>
        <p>Instagramで試している投稿も、このページで書いたやり方で出しています。</p>
        {/* 自社アカウントが決まったら href を Instagram のURLに変える */}
        <Link href="/" className="k-back">
          株式会社DP-GUILD のサイトへ
        </Link>
      </main>

      <footer className="k-foot">
        <div className="k-wrap">
          <nav aria-label="法的情報">
            <Link href="/privacy">プライバシーポリシー</Link>
          </nav>
          <p className="k-co">運営会社：株式会社DP-GUILD</p>
          <p className="k-cp">&copy; {new Date().getFullYear()} DP-GUILD. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
