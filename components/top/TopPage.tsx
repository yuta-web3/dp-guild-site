'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import { layers, company } from '@/lib/top-cases';

type Status = 'idle' | 'sending' | 'done' | 'error';

export default function TopPage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velRef = useRef(0);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [form, setForm] = useState({ company: '', website: '', name: '', email: '', phone: '' });
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

    let lastY = 0;
    let ticking = false;

    const onScroll = () => {
      const y = window.scrollY;
      velRef.current = velRef.current * 0.82 + Math.abs(y - lastY) * 0.18;
      lastY = y;

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
      if (raf) cancelAnimationFrame(raf);
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
                  <span>つくって、集めて、</span><span>回るところまで。</span>
                </h1>
                <p className="guide rv up" data-fd="2">
                  サイトもSNSも社内の仕組みも、同じ人が見ています。
                </p>

              </div>

            </div>

            {/* やれること。会社の幅をここで見せる。別ページへは送らない */}
            <div className="layers">
              {layers.map((l, i) => (
                <div className={`layer rv ${i % 2 === 0 ? 'left' : 'right'}`} data-fd={String(3 + i)} key={l.id}>
                  <h2>{l.title}</h2>
                  <ul>
                    {l.items.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <p>{l.note}</p>
                </div>
              ))}
            </div>

            {/* 資料請求の理由をここで作る。何をどう判断したかはページに載せない */}
            <p className="toask rv up" data-fd="6">
              どれから手をつけるかは、状況で変わります。実際にどう判断したかを
              <b>6件</b>、会社案内にまとめました。
            </p>

          </div>
        </section>

        {/* ==================== 相談パネル ==================== */}
        <aside className="rail" id="contact">
          <form className="card" onSubmit={onSubmit} noValidate>
            <div className="top">
              <div className="k">会社案内（無料）</div>
              <h2>
                どんな会社か
                <br />
                見てください
              </h2>
              <p>実際にどう判断したか6件と、できること・料金をまとめています。</p>
            </div>
            <div className="bd">
              {status === 'done' ? (
                <div className="done">
                  <p className="dt">受け付けました</p>
                  <p className="dd">
                    ご入力のメールアドレス宛に、担当より2営業日以内に会社案内をお送りします。
                  </p>
                </div>
              ) : (
                <>
                  {/* 任意。分かっていると、返信の前にサイトを見て
                      具体的な話ができる。必須にすると検討段階の人が止まる */}
                  <div className="fld">
                    <label htmlFor="top-company">
                      会社名・屋号 <span className="rq">必須</span>
                    </label>
                    <input
                      id="top-company"
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder="株式会社◯◯"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                    />
                  </div>
                  {/* 会社名より直接的。開けばどういう会社か分かる */}
                  <div className="fld">
                    <label htmlFor="top-website">
                      サイトのURL <span className="op">任意</span>
                    </label>
                    <input
                      id="top-website"
                      type="text"
                      inputMode="url"
                      autoComplete="url"
                      placeholder="example.com"
                      value={form.website}
                      onChange={(e) => setForm({ ...form, website: e.target.value })}
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
                    <label htmlFor="top-phone">
                      電話番号 <span className="op">任意</span>
                    </label>
                    <input
                      id="top-phone"
                      type="tel"
                      autoComplete="tel"
                      placeholder="000-0000-0000"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
                    <span>{status === 'sending' ? '送信中…' : '会社案内をもらう'}</span>
                  </button>
                  {status === 'error' && <p className="err">{errorMsg}</p>}
                  <p className="fnote">資料の送付とご連絡にのみ使用します。</p>
                </>
              )}
            </div>
          </form>
          <p className="railfoot">
            メールでも受け付けています　<a href={`mailto:${company.email}`}>{company.email}</a>
          </p>
        </aside>

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
          会社案内（無料）
          <small>どんな会社か見てください</small>
        </div>
        <a href="#contact">資料をもらう</a>
      </div>
    </div>
  );
}
