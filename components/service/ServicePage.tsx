'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import type { Service } from '@/lib/services';

// 9枚のタイルの飛来位置。バラバラの方向から来て 3×3 に組み上がる。
const TILES = [
  { cls: 'tile p', tx: '-260px', ty: '-180px', tr: '-22deg', ts: '.5', bars: 1 },
  { cls: 'tile g', tx: '40px', ty: '-320px', tr: '16deg', ts: '.6', bars: 2 },
  { cls: 'tile', tx: '300px', ty: '-210px', tr: '24deg', ts: '.55', bars: 2 },
  { cls: 'tile', tx: '-340px', ty: '30px', tr: '18deg', ts: '.6', bars: 2 },
  { cls: 'tile p', tx: '0px', ty: '340px', tr: '-14deg', ts: '.5', bars: 1 },
  { cls: 'tile g', tx: '330px', ty: '60px', tr: '-20deg', ts: '.6', bars: 2 },
  { cls: 'tile g', tx: '-280px', ty: '260px', tr: '26deg', ts: '.55', bars: 1 },
  { cls: 'tile', tx: '-30px', ty: '380px', tr: '12deg', ts: '.6', bars: 2 },
  { cls: 'tile p', tx: '320px', ty: '300px', tr: '-24deg', ts: '.5', bars: 2 },
];

// 右下から始めて、最後に左上（見出しの隣）へ置く。視線が左の文章へ戻るように。
const TILE_ORDER = [8, 5, 7, 4, 6, 2, 3, 1, 0];

const yen = (n: number) => n.toLocaleString('ja-JP');

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function ServicePage({ service }: { service: Service }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velRef = useRef(0);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '' });
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  // ---- 出現・スクロール駆動・背景の格子 ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 見出しを1文字ずつに割る
    root.querySelectorAll<HTMLElement>('.sp').forEach((el) => {
      if (el.dataset.split === '1') return;
      const t = el.textContent || '';
      el.dataset.split = '1';
      el.innerHTML = Array.from(t)
        .map((c, i) =>
          c === ' ' || c === '　'
            ? c
            : `<span class="ch"><i style="transition-delay:${(i * 0.024).toFixed(3)}s">${c}</i></span>`
        )
        .join('');
    });

    // FVは監視せず、読み込み直後に決まった順で再生する。
    // 最後に動くのは左下の一言。そこで視線を止めて、右のパネルへ渡す。
    const fv = Array.from(root.querySelectorAll<HTMLElement>('[data-fd]'));
    fv.forEach((el) => {
      el.style.transitionDelay = `${(0.06 + parseFloat(el.dataset.fd || '0') * 0.09).toFixed(3)}s`;
    });
    const tiles = Array.from(root.querySelectorAll<HTMLElement>('.tile'));
    TILE_ORDER.forEach((idx, i) => {
      if (tiles[idx]) tiles[idx].style.transitionDelay = `${(0.02 + i * 0.04).toFixed(3)}s`;
    });

    const boot = () => {
      root.classList.add('boot');
      fv.forEach((el) => el.classList.add('in'));
      tiles.forEach((t) => t.classList.add('in'));
      const h1 = root.querySelector('h1');
      if (h1) window.setTimeout(() => h1.classList.add('lit'), 260);
    };
    boot();

    // 出現は監視ではなく掃引。アンカーで飛んでも非表示のまま残らない。
    let pending = Array.from(root.querySelectorAll<HTMLElement>('.rv:not([data-fd])'));
    let pendingH = Array.from(root.querySelectorAll<HTMLElement>('.sp'));
    const sweep = () => {
      const limit = window.innerHeight * 1.04;
      if (pending.length) {
        pending = pending.filter((el) => {
          if (el.getBoundingClientRect().top > limit) return true;
          el.style.transitionDelay = `${(parseFloat(el.dataset.d || '0') * 0.055).toFixed(3)}s`;
          el.classList.add('in', 'on');
          return false;
        });
      }
      if (pendingH.length) {
        pendingH = pendingH.filter((el) => {
          if (el.getBoundingClientRect().top > window.innerHeight * 0.94) return true;
          el.classList.add('on');
          return false;
        });
      }
    };

    const layer = root.querySelector<HTMLElement>('.gridlayer');
    const grid = root.querySelector<HTMLElement>('.tiles');
    const steps = root.querySelector<HTMLElement>('.steps');
    const stepLis = steps ? Array.from(steps.querySelectorAll<HTMLElement>('li')) : [];
    let lastY = 0;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      velRef.current = velRef.current * 0.82 + Math.abs(y - lastY) * 0.18;
      lastY = y;
      if (RM) return;

      const p = Math.min(1, y / (window.innerHeight * 0.9));
      const e = 1 - Math.pow(1 - p, 1.7);
      if (layer) layer.style.transform = `translateY(${(e * -90).toFixed(1)}px)`;
      if (grid) grid.style.transform = `rotate(${(-7 + e * 9).toFixed(2)}deg) scale(${(1 - e * 0.06).toFixed(3)})`;

      if (steps && stepLis.length) {
        const r = steps.getBoundingClientRect();
        const mid = window.innerHeight * 0.62;
        const k = Math.max(0, Math.min(1, (mid - r.top) / r.height));
        steps.style.setProperty('--prog', `${(k * 100).toFixed(1)}%`);
        stepLis.forEach((li) => li.classList.toggle('on', li.getBoundingClientRect().top < mid));
      }
    };

    const handleScroll = () => {
      sweep(); // 出現はrAFに依存させない
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    const t1 = window.setTimeout(sweep, 120);
    const t2 = window.setTimeout(sweep, 600);

    // 背景：アイソメトリックの格子
    let raf = 0;
    const cv = canvasRef.current;
    if (!RM && cv) {
      const cx = cv.getContext('2d');
      if (cx) {
        const DPR = Math.min(2, window.devicePixelRatio || 1);
        const SP = 64;
        const TAN = Math.tan(Math.PI / 6);
        let W = 0;
        let H = 0;
        let segs: { a: string; o: number; life: number; sp: number }[] = [];
        let off = 0;

        const resize = () => {
          W = cv.clientWidth;
          H = cv.clientHeight;
          cv.width = W * DPR;
          cv.height = H * DPR;
          cx.setTransform(DPR, 0, 0, DPR, 0, 0);
          segs = [];
          for (let i = -30; i < 60; i++) {
            (['x', 'r', 'l'] as const).forEach((a) =>
              segs.push({ a, o: i * SP, life: Math.random(), sp: 0.0015 + Math.random() * 0.0038 })
            );
          }
        };

        const draw = () => {
          cx.clearRect(0, 0, W, H);
          off = (off + 0.13) % SP;
          const dens = Math.min(1, 0.55 + velRef.current * 0.03);
          for (let i = 0; i < segs.length; i++) {
            const s = segs[i];
            s.life += s.sp;
            if (s.life > 1) s.life -= 1;
            const a = Math.sin(s.life * Math.PI);
            if (a < 0.02) continue;
            const al = a * dens * 0.34;
            cx.strokeStyle =
              i % 7 === 0
                ? `rgba(15,191,176,${al * 1.7})`
                : i % 11 === 0
                  ? `rgba(122,69,232,${al * 1.5})`
                  : `rgba(40,70,140,${al})`;
            cx.lineWidth = 1;
            cx.beginPath();
            if (s.a === 'x') {
              const x = s.o + off;
              cx.moveTo(x, -50);
              cx.lineTo(x, H + 50);
            } else if (s.a === 'r') {
              const y0 = s.o + off;
              cx.moveTo(-50, y0 - 50 * TAN);
              cx.lineTo(W + 50, y0 + (W + 50) * TAN);
            } else {
              const y1 = s.o + off;
              cx.moveTo(-50, y1 + 50 * TAN);
              cx.lineTo(W + 50, y1 - (W + 50) * TAN);
            }
            cx.stroke();
          }
          velRef.current *= 0.94;
          raf = requestAnimationFrame(draw);
        };

        window.addEventListener('resize', resize);
        resize();
        draw();

        return () => {
          window.removeEventListener('scroll', handleScroll);
          window.removeEventListener('resize', onScroll);
          window.removeEventListener('resize', resize);
          window.clearTimeout(t1);
          window.clearTimeout(t2);
          cancelAnimationFrame(raf);
        };
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onScroll);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          service: service.slug,
          honeypot,
          timestamp: startedAt.current,
        }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || '送信に失敗しました');

      setStatus('done');
      if (result.docUrl) window.location.href = result.docUrl;
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '送信に失敗しました');
    }
  };

  // 見出しの下線を引く語で分割する
  const [beforeHl, afterHl] = service.title[1].split(service.titleHighlight);

  return (
    <div className="lp" ref={rootRef}>
      <canvas className="iso" ref={canvasRef} aria-hidden="true" />

      <SiteHeader here={service.label} inset />

      <div className="shell">
        {/* ==================== ファーストビュー ==================== */}
        <section className="fv">
          <div className="gridlayer" aria-hidden="true">
            <div className="tiles">
              {TILES.map((t, i) => (
                <div
                  key={i}
                  className={t.cls}
                  style={
                    {
                      '--tx': t.tx,
                      '--ty': t.ty,
                      '--tr': t.tr,
                      '--ts': t.ts,
                    } as React.CSSProperties
                  }
                >
                  <span className="lab">{String(i + 1).padStart(2, '0')}</span>
                  <i className="b1" />
                  {t.bars === 2 && <i className="b2" />}
                </div>
              ))}
            </div>
          </div>

          <div className="fvtxt">
            <div className="eyebrow rv up" data-fd="0">
              <i />
              <span>{service.label}</span>
            </div>
            <h1 className="rv up" data-fd="1">
              {service.title[0]}
              <br />
              {beforeHl}
              <span className="hl">{service.titleHighlight}</span>
              {afterHl}
            </h1>
            <p className="lede rv up" data-fd="2">
              {service.lede.map((line, i) => (
                <span key={i}>
                  {line}
                  {i < service.lede.length - 1 && <br />}
                </span>
              ))}
            </p>
            {service.termline && (
              <p className="termline rv up" data-fd="3">
                {service.termline}
              </p>
            )}
            <div className="facts rv up" data-fd="4">
              <div className="f">
                <div className="k">料金</div>
                <div className="v">
                  {yen(service.price)}
                  <small>{service.priceNote}</small>
                </div>
              </div>
              <div className="f">
                <div className="k">納品</div>
                <div className="v">
                  {service.delivery.replace(/[^0-9]/g, '')}
                  <small>{service.delivery.replace(/[0-9]/g, '')}</small>
                </div>
              </div>
              <div className="f">
                <div className="k">期間</div>
                <div className="v">
                  {service.period.replace(/[^0-9–-]/g, '')}
                  <small>{service.period.replace(/[0-9–-]/g, '')}</small>
                </div>
              </div>
            </div>
            <ul className="points rv up" data-fd="5">
              {service.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          <a
            className="handoff rv up"
            data-fd="6"
            href="#dl"
            onClick={(e) => {
              if (window.innerWidth > 1040) {
                e.preventDefault();
                rootRef.current?.querySelector<HTMLInputElement>('.card input')?.focus({
                  preventScroll: true,
                });
              }
            }}
          >
            <span>
              <span className="k">まだ決めなくて大丈夫です。</span>
              <span className="t">まずは資料をご覧ください</span>
            </span>
            <span className="ar" aria-hidden="true">
              →
            </span>
          </a>
        </section>

        {/* ==================== 資料請求パネル ==================== */}
        <aside className="rail" id="dl">
          <form className="card" onSubmit={onSubmit} noValidate>
            <div className="top">
              <div className="k">無料</div>
              <h2>
                サービス資料
                <br />
                ダウンロード
              </h2>
              <p>考え方・納品物のサンプル・料金をまとめています。</p>
            </div>
            <div className="bd">
              {status === 'done' ? (
                <div className="done">
                  <p className="dt">送信しました</p>
                  <p className="dd">
                    {service.doc
                      ? 'ダウンロードが始まらない場合は、お送りしたメールをご確認ください。'
                      : 'ご入力のメールアドレス宛に、担当より2営業日以内に資料をお送りします。'}
                  </p>
                </div>
              ) : (
                <>
                  <div className="fld">
                    <label htmlFor="doc-company">
                      会社名 <span className="rq">必須</span>
                    </label>
                    <input
                      id="doc-company"
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder="株式会社DP-GUILD"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div className="fld">
                    <label htmlFor="doc-name">
                      お名前 <span className="rq">必須</span>
                    </label>
                    <input
                      id="doc-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="山田 太郎"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="fld">
                    <label htmlFor="doc-email">
                      メールアドレス <span className="rq">必須</span>
                    </label>
                    <input
                      id="doc-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="fld">
                    <label htmlFor="doc-phone">
                      電話番号 <span className="op">任意</span>
                    </label>
                    <input
                      id="doc-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="06-0000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    />
                  </div>

                  {/* スパム対策（人には見えない） */}
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

                  <button className="sub" type="submit" disabled={status === 'sending'}>
                    <span>{status === 'sending' ? '送信中…' : '資料をダウンロード'}</span>
                  </button>
                  {status === 'error' && <p className="err">{errorMsg}</p>}
                  <p className="fnote">資料の送付とご連絡にのみ使用します。</p>
                </>
              )}
            </div>
          </form>
          <p className="railfoot">
            先に話したい方は <Link href="/contact">お問い合わせ</Link> へ
          </p>
        </aside>

        {/* ==================== 本文 ==================== */}
        <main className="body">
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">01</span>
              <h2 className="sp">こんな状態ではありませんか</h2>
            </div>
            <ul className="probs">
              {service.problems.map((p, i) => (
                <li key={i} className="rv up" data-d={String(i)}>
                  <span className="q">{String(i + 1).padStart(2, '0')}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            <div className="turn rv up" data-d="0">
              このサービスで、こうなります
            </div>
          </section>

          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">02</span>
              <h2 className="sp">何が変わるか</h2>
            </div>
            <ul className="gains">
              {service.gains.map((g, i) => (
                <li key={i} className="rv up" data-d={String(i)}>
                  <span className="n mono">{String(i + 1).padStart(2, '0')}</span>
                  <span>
                    <b>{g.t}</b>
                    <span>{g.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">03</span>
              <h2 className="sp">何をお渡しするか</h2>
            </div>
            <p className="sub2 rv up" data-d="1">
              すべて納品物としてお渡しします。作業を見せて終わり、にはしません。
            </p>
            <div className="deliv">
              {service.deliverables.map((d, i) => (
                <div key={i} className="row rv up" data-d={String(i)}>
                  <div className="t">{d.t}</div>
                  <div className="d">{d.d}</div>
                </div>
              ))}
            </div>
          </section>

          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">04</span>
              <h2 className="sp">含まないもの</h2>
            </div>
            <p className="sub2 rv up" data-d="1">
              できないことは先に書いておきます。あとで「聞いていない」が起きないように。
            </p>
            <div className="exclude rv up" data-d="0">
              <ul>
                {service.excludes.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* 斜めに切った帯：進め方 */}
          <div className="stepband">
            <section className="sec">
              <div className="sechead rv left" data-d="0">
                <span className="n mono">05</span>
                <h2 className="sp">進め方</h2>
              </div>
              <ul className="steps">
                {service.steps.map((s, i) => (
                  <li key={i} className="rv up" data-d={String(i)}>
                    <span className="n">{i + 1}</span>
                    <span>
                      <b>{s.t}</b>
                      <span>{s.d}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">06</span>
              <h2 className="sp">料金</h2>
            </div>
            <div className="plan rv tilt" data-d="0">
              <div className="pn">{service.label}</div>
              <div className="pp">
                {yen(service.price)}
                <small>{service.priceNote}</small>
              </div>
              <ul>
                {service.planItems.map((x, i) => (
                  <li key={i}>{x}</li>
                ))}
              </ul>
              <div className="pnote">
                {service.planNote.map((n, i) => (
                  <span key={i}>
                    {n}
                    {i < service.planNote.length - 1 && <br />}
                  </span>
                ))}
                <br />
                キャンセルの取り扱いは <Link href="/terms">利用規約</Link> 第6条をご確認ください。
              </div>
            </div>
          </section>

          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">07</span>
              <h2 className="sp">よくある質問</h2>
            </div>
            <div className="faq rv up" data-d="0">
              {service.faq.map((f, i) => (
                <details key={i} open={i === 0}>
                  <summary>{f.q}</summary>
                  <div className="a">{f.a}</div>
                </details>
              ))}
            </div>
          </section>

          {service.voice && (
            <section className="sec">
              <div className="sechead rv left" data-d="0">
                <span className="n mono">08</span>
                <h2 className="sp">お客様の声</h2>
              </div>
              <div className="voice rv tilt" data-d="0">
                <div className="who">{service.voice.who}</div>
                <q>{service.voice.quote}</q>
                <div className="meta">{service.voice.meta}</div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ==================== フッター ==================== */}
      <footer className="lpfoot">
        <div className="inner">
          <div className="co">
            <b>株式会社DP-GUILD</b>
            <span>〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9</span>
            <span>
              <a href="mailto:info@dp-guild.com">info@dp-guild.com</a>
            </span>
          </div>
          <nav>
            <Link href="/">ホーム</Link>
            <Link href="/about">会社概要</Link>
            <Link href="/results">実績・事例</Link>
            <Link href="/blog">ブログ</Link>
            <Link href="/contact">お問い合わせ</Link>
          </nav>
          <nav className="legal">
            <Link href="/terms">利用規約</Link>
            <Link href="/tokushoho">特定商取引法に基づく表記</Link>
            <Link href="/privacy">プライバシーポリシー</Link>
          </nav>
          <p className="cp">&copy; 2025 DP-GUILD. All rights reserved.</p>
        </div>
      </footer>

      {/* スマホ用の固定バー */}
      <div className="mbar">
        <div className="p">
          {yen(service.price)}
          <small>
            {service.priceNote} ／ {service.delivery}
          </small>
        </div>
        <a href="#dl">資料をもらう</a>
      </div>
    </div>
  );
}
