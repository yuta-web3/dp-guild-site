'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import type { Need } from '@/lib/needs';

// 入口ページ。
//
// 【大前提】ファーストビューしか見られない。
// だからスクロールさせないと結論に届かない作りにはしない。
// 症状 → 決め手（教育）→ 分岐 → 行き先 を、1画面の中に全部入れる。
//
// 教育は「読ませる」のではなく「一目で分かる」形にする。
// 長い説明は畳んでおいて、読みたい人だけが開く。
//
// 回遊させない。このページの中で問い合わせまで到達できるようにする。
// サービスページへのリンクは「詳しく見たい人向け」で、主導線ではない。

export default function NeedPage({ need }: { need: Need }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ company: '', website: '', name: '', email: '', content: '' });
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const items = Array.from(root.querySelectorAll<HTMLElement>('.rv'));
    if (RM) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
    // 画面に入った要素から順に出す。掃引方式にしないと、
    // 一気にスクロールされた時に飛ばされた要素が隠れたまま残る
    const sweep = () => {
      const h = window.innerHeight;
      items.forEach((el) => {
        if (el.classList.contains('in')) return;
        if (el.getBoundingClientRect().top < h - 40) el.classList.add('in');
      });
    };
    sweep();
    window.addEventListener('scroll', sweep, { passive: true });
    window.addEventListener('resize', sweep);
    const t = window.setTimeout(sweep, 400);
    return () => {
      window.removeEventListener('scroll', sweep);
      window.removeEventListener('resize', sweep);
      window.clearTimeout(t);
    };
  }, []);

  // 分岐カードから相談へ。押した用件を本文に入れ、入力欄まで運ぶ
  const askAbout = (title: string) => {
    setForm((f) => ({
      ...f,
      content: f.content || `「${title}」の内容と料金を知りたいです。`,
    }));
    const el = document.getElementById('need-company');
    if (!el) return;
    const rail = document.getElementById('contact');
    // パネルが下に回っている幅（狭い画面）では、まずパネルまで運ぶ
    if (rail && window.getComputedStyle(rail).position === 'static') {
      rail.scrollIntoView({ behavior: 'smooth', block: 'start' });
      window.setTimeout(() => el.focus({ preventScroll: true }), 420);
    } else {
      el.focus({ preventScroll: true });
    }
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
        body: JSON.stringify({ ...form, honeypot, timestamp: startedAt.current }),
      });
      const r = await res.json();
      if (!res.ok) throw new Error(r.error || '送信に失敗しました');
      setSent('done');
    } catch (err) {
      setSent('error');
      setMsg(err instanceof Error ? err.message : '送信に失敗しました');
    }
  };

  return (
    <div className="lp" ref={rootRef}>
      <SiteHeader here={need.title} inset />

      <div className="shell">
        {/* ============ ここまでで判断できるようにする ============ */}
        <section className="fv">
          <div className="fvtxt">
            <div className="fvhead">
              <p className="greet rv up">{need.title}</p>
              <h1 className="lead rv up">{need.heading}</h1>
            </div>

            {/* 症状。自分を見つけてもらう */}
            <ul className="symp rv up">
              {need.symptoms.map((s) => (
                <li key={s}>{s}</li>
              ))}
            </ul>

            {/* 教育の核心。ここだけ読めば、何で決まるかが分かる */}
            <p className="keyline rv up">{need.key}</p>

            {/* 分岐。ここまでをファーストビューに入れる */}
            <div className="picks">
              {need.branches.map((b) => (
                <div className="pick rv up" key={b.title}>
                  <p className="cond">{b.condition}</p>
                  <h2>{b.title}</h2>
                  <p className="sum">{b.body}</p>
                  <div className="meta">
                    <span>
                      <b>{b.term}</b>で渡します
                    </span>
                    <span>社内は{b.hand}</span>
                  </div>
                  {b.service ? (
                    <Link className="pickgo" href={`/services/${b.service.slug}`}>
                      内容と料金を見る
                      <i />
                    </Link>
                  ) : (
                    /* PCでは相談パネルが常に見えているので、#contact へ飛ばしても
                       画面が動かない。押した用件を本文に入れてフォーカスする */
                    <button
                      type="button"
                      className="pickgo"
                      onClick={() => askAbout(b.title)}
                    >
                      内容と料金を聞く
                      <i />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============ 以下は読みたい人だけ。既定では畳む ============ */}
        <div className="body">
          <details className="more">
            <summary>
              <span>手段ごとの効き方をくらべる</span>
              <i />
            </summary>
            <div className="apps">
              {need.approaches.map((a) => (
                <div className="app" key={a.name}>
                  <h3>{a.name}</h3>
                  <p className="ef">{a.effect}</p>
                  <dl>
                    <div>
                      <dt>効き始めるまで</dt>
                      <dd>{a.speed}</dd>
                    </div>
                    <div>
                      <dt>止めたとき</dt>
                      <dd>{a.stock}</dd>
                    </div>
                    <div>
                      <dt>社内で要るもの</dt>
                      <dd>{a.needs}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </details>

          <details className="more">
            <summary>
              <span>{need.learnTitle}</span>
              <i />
            </summary>
            <div className="learn">
              {need.learnBody.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </details>
        </div>

        <footer className="foot">
          <p className="cp">&copy; 2026 DP-GUILD. All rights reserved.</p>
        </footer>
      </div>

      {/* ============ 相談パネル。このページの中で完結させる ============ */}
      <aside className="rail" id="contact">
        <form className="card" onSubmit={onSubmit} noValidate>
          <div className="top">
            <div className="k">相談は無料です</div>
            <h2>
              どちらか迷えば
              <br />
              聞いてください
            </h2>
            <p>いまの状況だけ書いてください。1営業日以内に返信します。</p>
          </div>
          <div className="bd">
            {sent === 'done' ? (
              <div className="done">
                <p className="dt">送信しました</p>
                <p className="dd">1営業日以内に、ご入力のメールアドレス宛にご連絡します。</p>
              </div>
            ) : (
              <>
                <div className="fld">
                  <label htmlFor="need-company">
                    会社名・屋号 <span className="op">任意</span>
                  </label>
                  <input
                    id="need-company"
                    type="text"
                    autoComplete="organization"
                    placeholder="株式会社◯◯"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="need-website">
                    サイトのURL <span className="op">任意</span>
                  </label>
                  <input
                    id="need-website"
                    type="text"
                    inputMode="url"
                    autoComplete="url"
                    placeholder="example.com"
                    value={form.website}
                    onChange={(e) => setForm({ ...form, website: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="need-name">
                    お名前 <span className="rq">必須</span>
                  </label>
                  <input
                    id="need-name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="山田 太郎"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="need-email">
                    メールアドレス <span className="rq">必須</span>
                  </label>
                  <input
                    id="need-email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                </div>
                <div className="fld">
                  <label htmlFor="need-content">
                    いま困っていること <span className="rq">必須</span>
                  </label>
                  <textarea
                    id="need-content"
                    required
                    rows={3}
                    /* 入力例はページごとに変える。集客のページで在庫の例が出ると、
                       自分の話ではないと思われる */
                    placeholder={`例）${need.symptoms[0]}`}
                    value={form.content}
                    onChange={(e) => setForm({ ...form, content: e.target.value })}
                  />
                </div>

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

                <button className="sub" type="submit" disabled={sent === 'sending'}>
                  <span>{sent === 'sending' ? '送信中…' : '送信する'}</span>
                </button>
                {sent === 'error' && <p className="err">{msg}</p>}
                <p className="fnote">ご相談の内容とご連絡にのみ使用します。</p>
              </>
            )}
          </div>
          <div className="railfoot">
            メールでも受け付けています{' '}
            <a href="mailto:info@dp-guild.com">info@dp-guild.com</a>
          </div>
        </form>
      </aside>

      <div className="mbar">
        <div className="p">
          相談する
          <small>1営業日以内に返信します</small>
        </div>
        <a href="#contact">書いて送る</a>
      </div>
    </div>
  );
}
