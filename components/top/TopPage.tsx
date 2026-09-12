'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import { topCases, topDoors, company } from '@/lib/top-cases';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function TopPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velRef = useRef(0);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ company: '', name: '', email: '', content: '' });
  const [honeypot, setHoneypot] = useState('');
  const startedAt = useRef(0);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

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

    // ファーストビューは監視せず、読み込み直後に決まった順で再生する
    const fv = Array.from(root.querySelectorAll<HTMLElement>('[data-fd]'));
    fv.forEach((el) => {
      el.style.transitionDelay = `${(0.42 + parseFloat(el.dataset.fd || '0') * 0.08).toFixed(3)}s`;
    });
    // 立方体：描画長を確定させてから線を引く
    root.querySelectorAll<SVGPathElement>('.cube path.draw').forEach((path) => {
      try {
        path.style.setProperty('--len', String(path.getTotalLength()));
      } catch {
        path.style.setProperty('--len', '900');
      }
    });

    root.classList.add('boot');
    fv.forEach((el) => el.classList.add('in'));

    // 出現は監視ではなく掃引
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

    const faces = Array.from(root.querySelectorAll<SVGGElement>('.cube .face'));
    // 組み上がるまでは分解させない。「組み上がった」瞬間が無いと時間軸にならない
    let assembled = false;
    const assembleTimer = window.setTimeout(() => {
      assembled = true;
    }, 950);
    let lastY = 0;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      velRef.current = velRef.current * 0.82 + Math.abs(y - lastY) * 0.18;
      lastY = y;
      if (RM || !assembled) return;

      // 組み上がったあと、ファーストビューを抜けるまでの間で分解しきる
      const fvEl = root.querySelector<HTMLElement>('.fv');
      const span = Math.max(320, fvEl ? fvEl.offsetHeight : window.innerHeight * 0.6);
      const p = Math.min(1, y / span);
      const e = 1 - Math.pow(1 - p, 1.7);
      faces.forEach((g) => {
        // 左へ飛ぶ面はそのままだと本文の上を横切る。全体を右へ寄せ、
        // 文字にかかる前に消えきるよう透明化も前倒しする
        const fx = parseFloat(g.dataset.fx || '0') * 0.55 + 0.62;
        const fy = parseFloat(g.dataset.fy || '0');
        const dist = 260 * e;
        g.style.transform = `translate(${(fx * dist).toFixed(1)}px,${(fy * dist).toFixed(1)}px) rotate(${(fx * 11 * e).toFixed(2)}deg)`;
        g.style.opacity = String(Math.max(0, 1 - e * 1.45));
      });
    };

    const handleScroll = () => {
      sweep();
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    // ファーストビューのリンクから飛んできたら、その項目を開いておく
    const openFromHash = () => {
      const id = window.location.hash.replace('#', '');
      if (!id) return;
      const target = root.querySelector<HTMLDetailsElement>(`details.case2#${CSS.escape(id)}`);
      if (target) target.open = true;
    };
    openFromHash();
    window.addEventListener('hashchange', openFromHash);

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    const t1 = window.setTimeout(sweep, 120);
    const t2 = window.setTimeout(sweep, 600);

    // 背景：アイソメトリックの格子
    let raf = 0;
    const cv = canvasRef.current;
    let resize: (() => void) | null = null;
    if (!RM && cv) {
      const cx = cv.getContext('2d');
      if (cx) {
        const DPR = Math.min(2, window.devicePixelRatio || 1);
        const SP = 92; // 線の間隔。詰めすぎると文字と干渉して読みにくくなる
        const TAN = Math.tan(Math.PI / 6);
        let W = 0;
        let H = 0;
        let segs: { a: string; o: number; life: number; sp: number }[] = [];
        let off = 0;

        resize = () => {
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
      }
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('hashchange', openFromHash);
      window.removeEventListener('resize', onScroll);
      if (resize) window.removeEventListener('resize', resize);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(assembleTimer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;
    setStatus('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, honeypot, timestamp: startedAt.current }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || '送信に失敗しました');
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err instanceof Error ? err.message : '送信に失敗しました');
    }
  };

  return (
    <div className="lp" ref={rootRef}>
      <canvas className="iso" ref={canvasRef} aria-hidden="true" />

      <SiteHeader inset />

      <div className="shell">
        {/* ==================== ファーストビュー ==================== */}
        <section className="fv">
          <div className="fvtxt">
            <div className="fvtop">
              <div className="fvhead">
                <p className="greet rv up" data-fd="0">
                  お越しいただき、ありがとうございます。
                </p>
                {/* 文節ごとに区切る。こうしないと「こういうご／相談を」のように
                    語の途中で改行され、読むのに引っかかる */}
                <h1 className="lead rv up" data-fd="1">
                  <span>これまでに、</span><span>こういうご相談を</span><span>いただきました。</span>
                </h1>
                <p className="guide rv up" data-fd="2">
                  近いものを押してください。何をして、どうなったかが読めます。
                </p>

              </div>

            </div>

              {/* ロゴの不可能立体。線が1本ずつ引かれて組み上がり、スクロールで分解して飛んでいく。
                文字より先に組み上げ終える（最後に動いたものへ視線が行くため） */}
            <div className="cubewrap" aria-hidden="true">
            <svg className="cube" viewBox="0 0 500 530">
            <defs>
              <linearGradient id="cubeg" x1="0" y1="1" x2="1" y2="0">
                <stop offset="0%" stopColor="#0FBFB0" />
                <stop offset="42%" stopColor="#3560E0" />
                <stop offset="74%" stopColor="#7A45E8" />
                <stop offset="100%" stopColor="#C267F0" />
              </linearGradient>
            </defs>
            <g className="face" data-fx="0" data-fy="-1">
              <path className="draw d1" d="M250 60 L423.2 160 L250 260 L76.8 160 Z" />
              <path className="draw d4 thin" d="M250 102 L350.5 160 L250 218 L149.5 160 Z" />
            </g>
            <g className="face" data-fx="-0.87" data-fy="0.5">
              <path className="draw d2" d="M76.8 160 L250 260 L250 460 L76.8 360 Z" />
              <path className="draw d5 thin" d="M113.2 223 L213.6 281 L213.6 397 L113.2 339 Z" />
            </g>
            <g className="face" data-fx="0.87" data-fy="0.5">
              <path className="draw d3" d="M250 260 L423.2 160 L423.2 360 L250 460 Z" />
              <path className="draw d6 thin" d="M286.4 281 L386.8 223 L386.8 339 L286.4 397 Z" />
            </g>
            <g className="face" data-fx="0" data-fy="1.4">
              <path className="hide" d="M250 218 L250 302" />
              <path className="draw d7 thin" d="M250 218 L250 302" />
              <path className="hide" d="M213.6 281 L250 302 L286.4 281" />
              <path className="draw d8 thin" d="M213.6 281 L250 302 L286.4 281" />
            </g>
            <g className="face" data-fx="0" data-fy="-1">
              <path className="hide" d="M330 172 L250 218 L170 172" />
              <path className="draw d9 thin" d="M330 172 L250 218 L170 172" />
            </g>
              </svg>
            </div>

            <div className="caselist">
              {topCases.map((c, i) => (
                <a
                  className={`caseitem rv ${i % 2 === 0 ? 'left' : 'right'}`}
                  data-fd={String(3 + i)}
                  href={`#${c.id}`}
                  key={c.id}
                >
                  <span className="pb">
                    {c.problem}
                    <span className="wh">{c.who}</span>
                  </span>
                  <span className="go">
                    何をしたか読む
                    <i />
                  </span>
                </a>
              ))}
            </div>

          </div>
        </section>

        {/* ==================== 相談パネル ==================== */}
        <aside className="rail" id="contact">
          <form className="card" onSubmit={onSubmit} noValidate>
            <div className="top">
              <div className="k">先に話したい方へ／相談は無料です</div>
              <h2>
                ここに書いて
                <br />
                送ってください
              </h2>
              <p>まとまっていなくて大丈夫です。2営業日以内に返信します。</p>
            </div>
            <div className="bd">
              {status === 'done' ? (
                <div className="done">
                  <p className="dt">送信しました</p>
                  <p className="dd">
                    2営業日以内に、ご入力のメールアドレス宛にご連絡します。
                  </p>
                </div>
              ) : (
                <>
                  {/* 任意。分かっていると、返信の前にサイトを見て
                      具体的な話ができる。必須にすると検討段階の人が止まる */}
                  <div className="fld">
                    <label htmlFor="top-company">
                      会社名・屋号 <span className="op">任意</span>
                    </label>
                    <input
                      id="top-company"
                      type="text"
                      autoComplete="organization"
                      placeholder="株式会社◯◯"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  <div className="fld">
                    <label htmlFor="top-name">
                      お名前 <span className="rq">必須</span>
                    </label>
                    <input
                      id="top-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="山田 太郎"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                  </div>
                  <div className="fld">
                    <label htmlFor="top-email">
                      メールアドレス <span className="rq">必須</span>
                    </label>
                    <input
                      id="top-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                  </div>
                  <div className="fld">
                    <label htmlFor="top-content">
                      いま困っていること <span className="rq">必須</span>
                    </label>
                    <textarea
                      id="top-content"
                      required
                      rows={3}
                      placeholder="例）サイトから問い合わせが来ない"
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

                  <button className="sub" type="submit" disabled={status === 'sending'}>
                    <span>{status === 'sending' ? '送信中…' : '送信する'}</span>
                  </button>
                  {status === 'error' && <p className="err">{errorMsg}</p>}
                  <p className="fnote">ご相談の内容とご連絡にのみ使用します。</p>
                </>
              )}
            </div>
          </form>
          <p className="railfoot">
            メールでも受け付けています　<a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </aside>

        {/* ==================== 本文 ==================== */}
        <main className="body">
          {/* 相談の詳細 */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">01</span>
              <h2 className="sp">実際に何をしたか</h2>
            </div>
            <div className="cases2">
              {topCases.map((c, i) => (
                <details
                  className={`case2 rv ${i % 2 === 0 ? 'tilt' : 'tilt2'}`}
                  data-d={String(i % 2)}
                  id={c.id}
                  key={c.id}
                >
                  <summary>
                    <span className="sm">
                      <span className="pb">{c.problem}</span>
                      <span className="wh">{c.who}</span>
                    </span>
                    <span className="tg" aria-hidden="true" />
                  </summary>
                  <div className="in2">
                    <div className="step">
                      <div className="sl">何が起きていたか</div>
                      <p>{c.situation}</p>
                    </div>
                    <div className="step solve">
                      <div className="sl">どう解いたか</div>
                      <p>{c.did}</p>
                    </div>
                    <div className="step">
                      <div className="sl">どうなったか</div>
                      <p>{c.result}</p>
                    </div>
                    {c.voice && (
                      <div className="vo">
                        <q>{c.voice}</q>
                      </div>
                    )}
                    <div className="nx">
                      <a className="ask" href="#contact">
                        同じことでお困りなら、ここに書いて送ってください
                        <i />
                      </a>
                      {c.service && (
                        <Link href={`/services/${c.service.slug}`}>
                          {c.service.label}の内容と料金を見る
                          <i />
                        </Link>
                      )}
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* 何を頼めるか */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">02</span>
              <h2 className="sp">何を頼めるか</h2>
            </div>
            <p className="sub2 rv up" data-d="1">
              技術の名前ではなく、やりたいことから選べるようにしています。
            </p>
            <div className="doors">
              {topDoors.map((d, i) => (
                <Link className="door rv up" data-d={String(i)} href={d.href} key={d.id}>
                  <b>{d.title}</b>
                  <span>{d.desc}</span>
                  <span className="go">
                    相談する
                    <i />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          {/* 代表 */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">03</span>
              <h2 className="sp">誰がやるか</h2>
            </div>
            <div className="ceo">
              <div className="ph rv left" data-d="0">
                <Image
                  src="/images/team/ceo-photo.jpg"
                  alt="代表取締役 石井 勇多"
                  width={400}
                  height={500}
                />
              </div>
              <div className="rv up" data-d="1">
                <div className="nm">石井 勇多</div>
                <div className="rl">代表取締役</div>
                <p>
                  得意なのは、<b>導線を引くこと</b>
                  です。サイトでも、社内のシステムでも、人がどこを通ってどこで止まるのかを見て、動きやすい形に組み直す。そこが一番の強みだと思っています。
                </p>
                <p>
                  なので、<b>言われたものをそのまま作ることはしません。</b>
                  何に困っているかを先に聞いて、それなら別のやり方の方が早い、という話をすることもあります。
                </p>
              </div>
            </div>
          </section>

          {/* 会社情報 */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">04</span>
              <h2 className="sp">会社のこと</h2>
            </div>
            <div className="info rv up" data-d="0">
              <div className="row">
                <span className="k">社名</span>
                <span>{company.name}</span>
              </div>
              <div className="row">
                <span className="k">所在地</span>
                <span>
                  {company.zip} {company.address}
                </span>
              </div>
              <div className="row">
                <span className="k">設立</span>
                <span>{company.founded}</span>
              </div>
              <div className="row">
                <span className="k">代表者</span>
                <span>{company.ceo}</span>
              </div>
              <div className="row">
                <span className="k">法人番号</span>
                <span>{company.corporateNumber}</span>
              </div>
              <div className="row">
                <span className="k">従業員数</span>
                <span>{company.staff}</span>
              </div>
            </div>
          </section>
        </main>
      </div>

      {/* ==================== フッター ==================== */}
      <footer className="lpfoot">
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
          <nav>
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
          相談する
          <small>2営業日以内に返信します</small>
        </div>
        <a href="#contact">書いて送る</a>
      </div>
    </div>
  );
}
