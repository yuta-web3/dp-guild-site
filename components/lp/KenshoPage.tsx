'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import SiteHeader from '@/components/SiteHeader';
import { getLpPost, type LpPost } from '@/lib/lp-posts';

// 検証パッケージの無料相談LP。
//
// 【大前提】Instagram の投稿から、スマホのアプリ内ブラウザで、興味が薄い状態で開かれる。
// 最初の1画面で「何を言っているか」が分かり、「無料で相談する」に届くことを最優先にする。
//
// 【動き】飾りではなく、目を「次に見せたいもの」へ連れて行く道具としてだけ使う。
//   同時に動くのは1つ ／ 動く方向は次に読むものへ（下へ） ／ 読み終わったものは二度と動かない
//   入口：H1 → 本文 → ボタン の順に時間差で出す（.ent）。ボタンは出た直後に1回だけ強調
//   証拠：見出しの直後に投稿の画像が出て、目を画像に落とす
//   仕組み：3工程を 1 → 2 → 3 の順に出す
//   非保証の一文：動かさない（.rv を付けない）
//   それ以外：視界に入ったら 300ms で現れるだけ（.rv / .in）
//   prefers-reduced-motion: reduce で全て静止
//
// 【文言】結果の言葉ではなく工程の言葉。効果・結果を約束しない。

// ---- 定数。ここだけ変えれば表示が変わる ----
const LP = {
  // 証拠セクションの添え文。広告化したら 'ad' に切り替える
  proofMode: 'organic' as 'organic' | 'ad',
  // 価格・期間。未設定（null）なら「価格はご相談時にお伝えします」を出す
  price: null as string | null,
  term: null as string | null,
};

const PROOF_TEXT = {
  organic: 'まだ広告にしていません。反応が出たので、これから広告にします。',
  ad: 'この広告は、試した投稿の中から数字で選ばれたものです。',
} as const;

// Meta ピクセル。未設定なら何も読み込まない
const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
type UtmKey = (typeof UTM_KEYS)[number];
type Tracking = Record<UtmKey, string> & { landing: string };

const emptyTracking: Tracking = {
  utm_source: '',
  utm_medium: '',
  utm_campaign: '',
  utm_content: '',
  landing: '',
};

export default function KenshoPage() {
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState<'idle' | 'sending' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ company: '', name: '', email: '', content: '' });
  const [honeypot, setHoneypot] = useState('');
  const [tracking, setTracking] = useState<Tracking>(emptyTracking);
  const [post, setPost] = useState<LpPost | undefined>(undefined);
  const startedAt = useRef(0);

  // URL から経路と投稿IDを読む。対応表にある投稿IDのときだけ画像を出す
  useEffect(() => {
    startedAt.current = Date.now();
    const sp = new URLSearchParams(window.location.search);
    const next: Tracking = { ...emptyTracking };
    UTM_KEYS.forEach((k) => {
      next[k] = (sp.get(k) ?? '').slice(0, 100);
    });
    next.landing = (window.location.pathname + window.location.search).slice(0, 300);
    setTracking(next);
    setPost(getLpPost(next.utm_content));
  }, []);

  // 出現。入口は時間差（.boot）、それ以外は視界に入った順（.rv → .in）
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = Array.from(root.querySelectorAll<HTMLElement>('.rv'));
    if (RM) {
      root.classList.add('boot');
      items.forEach((el) => el.classList.add('in'));
      return;
    }

    // 入口の時間差は CSS の transition-delay。次の描画で .boot を付けて始める
    const raf = window.requestAnimationFrame(() => root.classList.add('boot'));

    // 画面に入った要素から順に出す。掃引方式にしないと、
    // 一気にスクロールされた時に飛ばされた要素が隠れたまま残る。
    // 同じ掃引で複数見つかった要素は、DOM順に少しずつずらして「同時に動くのは1つ」に近づける。
    // すでに通り過ぎた要素（視界の上）は待たせずに出す
    const sweep = () => {
      const h = window.innerHeight;
      let i = 0;
      items.forEach((el) => {
        if (el.classList.contains('in')) return;
        const r = el.getBoundingClientRect();
        if (r.top >= h - 40) return;
        const passed = r.bottom < 0;
        el.style.transitionDelay = passed ? '0ms' : `${i * 220}ms`;
        if (!passed) i += 1;
        el.classList.add('in');
      });
    };
    sweep();
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    const t = window.setTimeout(sweep, 400);
    return () => {
      window.cancelAnimationFrame(raf);
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('resize', sweep);
      window.clearTimeout(t);
    };
  }, []);

  // 入口の「無料で相談する」。フォームまで運び、最初の入力欄に焦点を当てる
  const goForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const formEl = document.getElementById('k-form');
    const first = document.getElementById('k-company');
    if (!formEl) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    formEl.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => first?.focus({ preventScroll: true }), RM ? 0 : 520);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sent === 'sending') return;
    setSent('sending');
    setMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, honeypot, timestamp: startedAt.current, ...tracking }),
      });
      const r = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          res.status === 400 && r.error
            ? r.error
            : '送信に失敗しました。時間をおいて、もう一度お試しください。',
        );
      }
      // 送信成功 → Lead。ピクセル未設定なら fbq は無い
      window.fbq?.('track', 'Lead');
      // UTM を引き継いで完了画面へ
      const q = new URLSearchParams();
      UTM_KEYS.forEach((k) => {
        if (tracking[k]) q.set(k, tracking[k]);
      });
      const qs = q.toString();
      router.push(`/lp/kensho/thanks${qs ? `?${qs}` : ''}`);
    } catch (err) {
      setSent('error');
      setMsg(err instanceof Error ? err.message : '送信に失敗しました');
    }
  };

  return (
    <div className="lp kensho" ref={rootRef}>
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(PIXEL_ID)});fbq('track','PageView');`}
        </Script>
      )}

      <SiteHeader here="検証パッケージ" />

      <main className="k-wrap">
        {/* ============ 1. 入口。この1画面にボタンまで収める ============ */}
        <section className="k-hero">
          <h1 className="k-h1 ent e1">効くかどうか分からない広告に、お金を払っていませんか。</h1>
          <p className="k-lede ent e2">
            出す前に、効くかどうかを確かめる。反応が出た投稿だけを広告にする。それが、私たちのやり方です。
          </p>
          <div className="k-ctawrap ent e3">
            <a href="#k-form" className="k-cta" onClick={goForm}>
              無料で相談する
            </a>
          </div>
        </section>

        {/* ============ 2. 証拠。見出しは常に。画像は投稿IDが合うときだけ ============ */}
        <section className="k-sec k-proof">
          <h2 className="rv">Instagramの投稿から来ましたよね。</h2>
          {post && (
            <figure className="k-post rv k-drop">
              <Image
                src={post.src}
                alt={post.alt}
                width={post.width ?? 1080}
                height={post.height ?? 1350}
                sizes="(max-width: 640px) 80vw, 300px"
                unoptimized
              />
              <figcaption>{PROOF_TEXT[LP.proofMode]}</figcaption>
            </figure>
          )}
        </section>

        {/* ============ 3. 困りごと ============ */}
        <section className="k-sec">
          <h2 className="rv">広告を出したいけど、出せない。</h2>
          <ul className="k-list">
            <li className="rv">効果があるか分からないから、踏み切れない</li>
            <li className="rv">出してみたけど、当たったのかどうかも分からなかった</li>
            <li className="rv">広告代理店に頼むほどの予算はない</li>
          </ul>
        </section>

        {/* ============ 4. 仕組み。3工程を 1 → 2 → 3 の順に ============ */}
        <section className="k-sec k-how">
          <h2 className="rv">出す前に、確かめる。</h2>
          <ol className="k-steps">
            <li className="k-step rv">
              <span className="n">1</span>
              <div>
                <b>試す</b>
                <span>訴求の違う投稿をオーガニックで出す</span>
              </div>
            </li>
            <li className="k-step rv">
              <span className="n">2</span>
              <div>
                <b>選ぶ</b>
                <span>反応の数字で当たりを選ぶ</span>
              </div>
            </li>
            <li className="k-step rv">
              <span className="n">3</span>
              <div>
                <b>出す</b>
                <span>当たった投稿だけを広告にする</span>
              </div>
            </li>
          </ol>
          <p className="k-note rv">
            選ぶのは、感覚ではなく数字。なぜ反応したかを分析する考え方があります。
          </p>
        </section>

        {/* ============ 5. 工程の約束 ============ */}
        <section className="k-sec">
          <h2 className="rv">反応が出なければ、広告に進みません。</h2>
          <p className="k-body rv">オーガニックで反応が出なかった場合、広告費は発生しません。</p>
        </section>

        {/* ============ 6. 手に入るもの ============ */}
        <section className="k-sec">
          <h2 className="rv">手に入るもの</h2>
          <ul className="k-list">
            <li className="rv">反応が出た投稿（広告素材）</li>
            <li className="rv">なぜ反応したかのレポート</li>
            <li className="rv">広告に進む場合の設計</li>
          </ul>
        </section>

        {/* ============ 7. 価格。金額・期間は定数。未設定なら相談時に ============ */}
        <section className="k-sec">
          <h2 className="rv">価格</h2>
          <div className="k-price rv">
            {LP.price ? (
              <p className="k-amount">
                {LP.price}
                {LP.term && <small>／ {LP.term}</small>}
              </p>
            ) : (
              <p className="k-amount k-tbd">価格はご相談時にお伝えします</p>
            )}
            <div className="k-inc">
              <div>
                <h3>含まれるもの</h3>
                <ul>
                  <li>制作</li>
                  <li>配信</li>
                  <li>計測</li>
                  <li>レポート</li>
                </ul>
              </div>
              <div>
                <h3>含まれないもの</h3>
                <ul>
                  <li>広告費（お客様の広告アカウントで直接お支払い）</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ============ 8. 必須の一文。本文と同じ大きさ・同じ色。動かさない ============ */}
        <section className="k-sec">
          <p className="k-must">
            本サービスは、投稿の制作・配信・計測・分析を行うものであり、売上や集客などの効果を保証するものではありません。
          </p>
        </section>

        {/* ============ 9. 無料相談フォーム ============ */}
        <section className="k-sec k-formsec" id="k-form">
          <h2 className="rv">無料相談</h2>
          <p className="k-body rv">事業者の方向けのサービスです。2営業日以内に、メールで返信します。</p>

          <form className="k-form" onSubmit={onSubmit} noValidate>
            <div className="fld">
              <label htmlFor="k-company">
                会社名・屋号 <span className="op">任意</span>
              </label>
              <input
                id="k-company"
                type="text"
                autoComplete="organization"
                placeholder="株式会社◯◯"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div className="fld">
              <label htmlFor="k-name">
                お名前 <span className="rq">必須</span>
              </label>
              <input
                id="k-name"
                type="text"
                required
                autoComplete="name"
                placeholder="山田 太郎"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="fld">
              <label htmlFor="k-email">
                メールアドレス <span className="rq">必須</span>
              </label>
              <input
                id="k-email"
                type="email"
                required
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div className="fld">
              <label htmlFor="k-content">
                相談したいこと <span className="op">任意</span>
              </label>
              <textarea
                id="k-content"
                rows={3}
                placeholder="例）広告を出したいが、何から試せばいいか分からない"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </div>

            {/* 経路。隠し項目で送る */}
            <input type="hidden" name="utm_source" value={tracking.utm_source} />
            <input type="hidden" name="utm_medium" value={tracking.utm_medium} />
            <input type="hidden" name="utm_campaign" value={tracking.utm_campaign} />
            <input type="hidden" name="utm_content" value={tracking.utm_content} />
            <input type="hidden" name="landing" value={tracking.landing} />

            {/* スパム対策の入力欄（人には見せない） */}
            <input
              type="text"
              name="company_url"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hp"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />

            <button className="k-cta k-sub" type="submit" disabled={sent === 'sending'}>
              {sent === 'sending' ? '送信中…' : '無料で相談する'}
            </button>
            {sent === 'error' && <p className="k-err">{msg}</p>}
            <p className="k-fnote">ご相談の内容とご連絡にのみ使用します。</p>
          </form>
        </section>
      </main>

      {/* ============ 10. 法務 ============ */}
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
