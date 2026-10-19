import { SiteFooterNav } from '@/components/SiteNav';
import { company } from '@/lib/top-cases';
import './site-foot.css';

// サイト共通のフッター（.lp の外のページ用：ブログ・お礼・法務）。
// .lp のページ（トップ・サービス・お問い合わせ）の lpfoot と同じ見た目にしている
export default function SiteFooter() {
  return (
    <footer className="site-foot">
      <div className="inner">
        <div className="co">
          <b>{company.name}</b>
          <span>
            {company.zip} {company.address}
          </span>
          <span>
            <a href={`mailto:${company.email}`}>{company.email}</a>
          </span>
        </div>
        <SiteFooterNav />
        <p className="cp">&copy; 2026 DP-GUILD. All rights reserved.</p>
      </div>
    </footer>
  );
}
