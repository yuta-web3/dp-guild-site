'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SiteHeader from '@/components/SiteHeader';
import { layers, stance, outcomes, company } from '@/lib/top-cases';
import { judgmentCases } from '@/lib/cases';

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


        {/* ==================== 本文 ====================
            FVはここに書いてあることの要約。FVで判断できなかった人が
            読む場所なので、削らずに書く。ただし別ページへは送らない */}
        <main className="body">
          {/* どういう会社か。資料を請求する理由がここにある */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">01</span>
              <h2 className="sp">どういう会社か</h2>
            </div>
            <div className="stance rv up" data-d="1">
              <p className="sl">{stance.lead}</p>
              <p className="sb2">{stance.body}</p>
              <p className="sp2">{stance.point}</p>
            </div>

            <p className="sub2 rv up" data-d="2">判断した結果、こうなることがあります。</p>
            <ul className="outs">
              {outcomes.map((o, i) => (
                <li className="out rv up" data-d={String(3 + i)} key={o.when}>
                  <b>{o.when}</b>
                  <span>{o.then}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* 判断事例。却下した案とその理由まで見せる */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">02</span>
              <h2 className="sp">実際にどう判断したか</h2>
            </div>
            <p className="sub2 rv up" data-d="1">
              売れるものを勧めたのではなく、何を却下したかまで書いています。
            </p>
            <div className="cases2">
              {judgmentCases.map((c, i) => (
                <details className="case2 rv up" data-d={String(i)} key={c.id}>
                  <summary>
                    <span className="cn mono">{c.id}</span>
                    <span className="ct">{c.consultation}</span>
                    <span className="cw">{c.client}</span>
                    <span className="ci" aria-hidden="true" />
                  </summary>
                  <div className="cbody">
                    <div className="step">
                      <p className="sl">出した選択肢</p>
                      <ul className="opts">
                        {c.options.map((o) => (
                          <li key={o}>{o}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="step no">
                      <p className="sl">却下した案と、その理由</p>
                      <p>{c.rejected}</p>
                    </div>
                    <div className="step solve">
                      <p className="sl">決めたこと</p>
                      <p>{c.finalDecision}</p>
                      <p className="why">{c.reason}</p>
                    </div>
                    <div className="step">
                      <p className="sl">どうなったか</p>
                      <p>{c.after}</p>
                    </div>
                  </div>
                </details>
              ))}
            </div>
          </section>

          {/* 誰がやるか */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">03</span>
              <h2 className="sp">誰がやるか</h2>
            </div>
            <div className="ceo2 rv up" data-d="0">
              <p className="nm">{company.ceo}</p>
              <p className="tx">
                2019年、滋賀県甲賀市で創業。地域の中小企業に向き合う中で、施策より先に
                「何から手をつけるか」の判断が要ると気づきました。だから、売れるものを
                勧めるのではなく、要らないものは要らないと言います。
              </p>
            </div>
          </section>

          {/* 会社のこと */}
          <section className="sec">
            <div className="sechead rv left" data-d="0">
              <span className="n mono">04</span>
              <h2 className="sp">会社のこと</h2>
            </div>
            <div className="info rv up" data-d="0">
              <div className="row"><span>会社名</span><span>{company.name}</span></div>
              <div className="row"><span>所在地</span><span>{company.zip} {company.address}</span></div>
              <div className="row"><span>設立</span><span>{company.founded}</span></div>
              <div className="row"><span>代表者</span><span>{company.ceo}</span></div>
              <div className="row"><span>法人番号</span><span>{company.corporateNumber}</span></div>
              <div className="row"><span>体制</span><span>{company.staff}</span></div>
            </div>
          </section>

          {/* 読み終えた人のゴール。FVと同じ場所へ */}
          <section className="sec">
            <div className="endcta rv up" data-d="0">
              <p className="et">ここまでの内容と、料金をまとめた会社案内をお送りします。</p>
              <a className="eb" href="#contact">会社案内をもらう<i /></a>
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
