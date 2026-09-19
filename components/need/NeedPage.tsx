'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import type { Need } from '@/lib/needs';

// 入口ページの見た目と動き。データは lib/needs.ts。
//
// 構成は 教育 → 判断（比べる表）→ 分岐（体制で選ぶ）の順。
// ファーストビューでは「自分の状態」を見つけてもらうところまでを目標にする。
// ここで商品名は出さない。読む人はまだ商品を探していない。

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

    // 入場。画面に入った要素から順に出す。
    // IntersectionObserver だけだと、一気にスクロールされた時に
    // 飛ばされた要素が永久に隠れたままになるので掃引方式にする
    const items = Array.from(root.querySelectorAll<HTMLElement>('.rv'));
    if (RM) {
      items.forEach((el) => el.classList.add('in'));
      return;
    }
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
        {/* ==================== ファーストビュー ==================== */}
        <section className="fv">
          <div className="fvtxt">
            <div className="fvhead">
              <p className="greet rv up">{need.title}</p>
              <h1 className="lead rv up">{need.heading}</h1>
              <p className="guide rv up">{need.lead}</p>
            </div>

            {/* 自分の状態を見つけてもらう。ここが入口 */}
            <div className="caselist">
              {need.symptoms.map((s, i) => (
                <div className={`caseitem rv ${i % 2 === 0 ? 'left' : 'right'}`} key={s}>
                  <span className="pb">{s}</span>
                </div>
              ))}
            </div>
            <p className="guide rv up" style={{ marginTop: 14 }}>
              近いものがあれば、この下に何をすればいいかを書いています。
            </p>
          </div>
        </section>

        <div className="body">
          {/* ==================== 教育 ==================== */}
          <section className="sec">
            <div className="sechead">
              <span className="n">01</span>
              <h2>{need.learnTitle}</h2>
            </div>
            <div className="learn">
              {need.learnBody.map((p, i) => (
                <p className="rv up" key={i}>
                  {p}
                </p>
              ))}
            </div>
          </section>

          {/* ==================== 比べる ==================== */}
          <section className="sec">
            <div className="sechead">
              <span className="n">02</span>
              <h2>手段ごとに、効き方が違います</h2>
            </div>
            <p className="sub2">効くまでの速さと、止めたときに残るかどうかで選びます。</p>

            <div className="apps">
              {need.approaches.map((a) => (
                <div className="app rv up" key={a.name}>
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
          </section>

          {/* ==================== 分岐 ==================== */}
          <section className="sec">
            <div className="sechead">
              <span className="n">03</span>
              <h2>{need.branchTitle}</h2>
            </div>

            <div className="brs">
              {need.branches.map((b) => (
                <div className="br rv up" key={b.title}>
                  <p className="cond">{b.condition}</p>
                  <h3>{b.title}</h3>
                  <p className="bd2">{b.body}</p>
                  <dl>
                    <div>
                      <dt>かかる期間</dt>
                      <dd>{b.term}</dd>
                    </div>
                    <div>
                      <dt>社内で必要な手</dt>
                      <dd>{b.hand}</dd>
                    </div>
                  </dl>
                  {b.service ? (
                    <Link className="brgo" href={`/services/${b.service.slug}`}>
                      {b.service.label}の内容と料金を見る
                      <i />
                    </Link>
                  ) : (
                    <p className="brnote">
                      内容と料金は、右のフォームからお問い合わせください。
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <footer className="foot">
          <p className="cp">&copy; 2025 DP-GUILD. All rights reserved.</p>
        </footer>
      </div>

      {/* ==================== 相談パネル ==================== */}
      <aside className="rail" id="contact">
        <form className="card" onSubmit={onSubmit} noValidate>
          <div className="top">
            <div className="k">相談は無料です</div>
            <h2>
              どれが近いか
              <br />
              分からなくて大丈夫
            </h2>
            <p>いまの状況だけ書いてください。2営業日以内に返信します。</p>
          </div>
          <div className="bd">
            {sent === 'done' ? (
              <div className="done">
                <p className="dt">送信しました</p>
                <p className="dd">2営業日以内に、ご入力のメールアドレス宛にご連絡します。</p>
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
                    placeholder="例）Instagramを始めたが数本で止まっている"
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

      {/* スマホ用の固定バー */}
      <div className="mbar">
        <div className="p">
          相談する
          <small>2営業日以内に返信します</small>
        </div>
        <a href="#contact">書いて送る</a>
      </div>
    </div>
  );
}
