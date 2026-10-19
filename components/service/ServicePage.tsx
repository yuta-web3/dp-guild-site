'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import SiteHeader from '@/components/SiteHeader';
import { SiteFooterNav } from '@/components/SiteNav';
import IsoCube from '@/components/service/IsoCube';
import { company } from '@/lib/top-cases';
import type { Service, TD } from '@/lib/services';

// サービスページの器。全サービスでこの1枚を使い、文字だけを lib/services/<slug>.ts から差し替える。
// 見た目の言語はトップ（components/top/TopPage.tsx）と同じ：右端の全高パネル・ロゴの不可能立体・背景の格子。
// ゴールは資料請求1つ。ほかのページへは送らない。
//
// ファーストビューは JS を待たずに CSS だけで出す（JS が無い・遅い環境でも白紙にしない）。
// JS が担うのは、2画面目以降の出現・スクロールでの立方体の分解・背景の格子・フォームの送信だけ。

const yen = (n: number) => n.toLocaleString('ja-JP');
// 金額の書き方は「20万」の形に1つにそろえる（数字の欄・固定バー・料金カード）。万で割り切れないときだけ 3桁区切り
const man = (n: number) => (n % 10000 === 0 ? `${(n / 10000).toLocaleString('ja-JP')}万` : yen(n));
const pad = (n: number) => String(n).padStart(2, '0');

type Status = 'idle' | 'sending' | 'done' | 'error';
type Field = 'company' | 'name' | 'email';

// ---- 実績の数字を目に入る形にする ----
// 数字（150万回・6万回以上・1,000本以上 など）だけを等幅の太字にする。文言は変えない
const NUM_G = /[0-9][0-9,.]*万?(?:回|人|本)(?:以上)?/g;
const hasNum = (s: string) => new RegExp(NUM_G.source).test(s);
function markNum(s: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const m of s.matchAll(NUM_G)) {
    const i = m.index ?? 0;
    if (i > last) out.push(s.slice(last, i));
    out.push(
      <b className="fig" key={i}>
        {m[0]}
      </b>
    );
    last = i + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
// 見出しに数字が無い実績は、本文から「数字を含むひとかたまり」をそのまま抜き出す（言い換えない）
const AD = '(?:広告なしで|広告を使わずに|広告を一切使わずに)?';
// 優先順：再生回数 → フォロワー数（「フォロワー」の語ごと）→「◯本以上」。何の数字か分からない形では抜かない
const FIGS = [
  new RegExp(`${AD}[0-9][0-9,.]*万回(?:以上)?(?:見られた動画|再生された動画|再生)?`),
  /フォロワー[0-9][0-9,.]*万人/,
  new RegExp(`${AD}[0-9][0-9,.]*(?:回|本)以上`),
];
function figureOf(p: TD): string | null {
  if (hasNum(p.t)) return null;
  for (const re of FIGS) {
    const m = p.d.match(re);
    if (m) return m[0];
  }
  return null;
}

// 数字の無い実績をFVに出すときに添える1文。本文（d）から、結果を言い切った1文をそのまま抜く（言い換えない）。
// 先頭から見て「〜ました。」で終わる短い文。無ければ最後の短い文（「公開後も保守を続けています」など）
function leadSentence(d: string): string | null {
  const ss = d
    .split('。')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x + '。');
  const MAX = 56;
  const done = ss.find((x) => /ました。$/.test(x) && x.length <= MAX);
  if (done) return done;
  const last = ss[ss.length - 1];
  return ss.length > 1 && last && last.length <= 40 ? last : null;
}

type Gtag = (...args: unknown[]) => void;
const gtagOf = (): Gtag | null => {
  const w = window as unknown as { gtag?: Gtag };
  return typeof w.gtag === 'function' ? w.gtag : null;
};

// モニター価格の一文目（「…の価格：…（税別）。」まで）。パネルとFVに出す
function monitorHead(s: string | null): string | null {
  if (!s) return null;
  const i = s.indexOf('。');
  return i >= 0 ? s.slice(0, i + 1) : s;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ServicePage({ service }: { service: Service }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const velRef = useRef(0);

  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [errs, setErrs] = useState<Partial<Record<Field, string>>>({});
  const [form, setForm] = useState({ company: '', website: '', name: '', email: '', phone: '' });
  const [honeypot, setHoneypot] = useState('');
  const [stepTab, setStepTab] = useState(0);
  const [dlVisible, setDlVisible] = useState(false);
  // 送信が早すぎるかの判定は「最初に入力欄に触れた時刻」から数える。ページを開いた時刻からだと、
  // 自動入力ですぐ押した本物の人をはじく。触れずに送られたときだけ、開いた時刻を使う
  const loadedAt = useRef(0);
  const touchedAt = useRef(0);

  useEffect(() => {
    loadedAt.current = Date.now();
  }, []);

  const onFirstTouch = () => {
    if (touchedAt.current) return;
    touchedAt.current = Date.now();
    // 計測：入力を始めた（どこで離脱したかを見るため）
    gtagOf()?.('event', 'form_start', { service: service.slug });
  };

  // ---- 出現・スクロール駆動・背景の格子 ----
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // 2画面目以降の見出しを1文字ずつに割る（FVの見出しは割らない。JSを待たせないため）
    root.querySelectorAll<HTMLElement>('.sp').forEach((el) => {
      if (el.dataset.split === '1') return;
      const t = el.textContent || '';
      el.dataset.split = '1';
      el.setAttribute('aria-label', t);
      el.innerHTML = Array.from(t)
        .map((c, i) =>
          c === ' ' || c === '　'
            ? c
            : `<span class="ch" aria-hidden="true"><i style="transition-delay:${(i * 0.024).toFixed(3)}s">${c}</i></span>`
        )
        .join('');
    });

    // 出現は監視ではなく掃引。アンカーで飛んでも非表示のまま残らない
    let pending = Array.from(root.querySelectorAll<HTMLElement>('.rv:not([data-fd])'));
    let pendingH = Array.from(root.querySelectorAll<HTMLElement>('.sp'));
    const sweep = () => {
      const limit = window.innerHeight * 1.04;
      if (pending.length) {
        pending = pending.filter((el) => {
          // タブで隠れている進め方は、見えたときに掃引する
          if (el.closest('[hidden]')) return true;
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

    const fvEl = root.querySelector<HTMLElement>('.fv');
    const faces = Array.from(root.querySelectorAll<SVGGElement>('.cube .face'));
    // 進め方の項目は最初に1回だけ取る（スクロールのたびに探さない）
    const stepLists = Array.from(root.querySelectorAll<HTMLElement>('.steps')).map((el) => ({
      el,
      lis: Array.from(el.querySelectorAll<HTMLElement>('li')),
    }));
    // 組み上がるまでは分解させない。「組み上がった」瞬間が無いと時間軸にならない
    let assembled = false;
    let lastY = 0;
    let ticking = false;
    let facesMoved = false;

    const onScroll = () => {
      const y = window.scrollY;
      velRef.current = velRef.current * 0.82 + Math.abs(y - lastY) * 0.18;
      lastY = y;
      if (RM) return;

      // 立方体の分解は、立方体の帯を取れる広い画面だけ。狭い画面では文字の上を横切るので動かさない
      if (assembled && window.innerWidth > 1040) {
        const span = Math.max(320, fvEl ? fvEl.offsetHeight * 0.8 : window.innerHeight * 0.6);
        const p = Math.min(1, y / span);
        const e = 1 - Math.pow(1 - p, 1.7);
        faces.forEach((g) => {
          // 本文の上を横切らないよう、全体を右へ寄せて文字にかかる前に消しきる
          const fx = parseFloat(g.dataset.fx || '0') * 0.55 + 0.62;
          const fy = parseFloat(g.dataset.fy || '0');
          const dist = 240 * e;
          g.style.transform = `translate(${(fx * dist).toFixed(1)}px,${(fy * dist).toFixed(1)}px) rotate(${(fx * 11 * e).toFixed(2)}deg)`;
          g.style.opacity = String(Math.max(0, 1 - e * 1.45));
        });
        facesMoved = true;
      } else if (facesMoved) {
        faces.forEach((g) => {
          g.style.transform = '';
          g.style.opacity = '';
        });
        facesMoved = false;
      }

      // 進め方：読んでいる位置まで線が伸び、通過した番号が埋まる
      const mid = window.innerHeight * 0.62;
      stepLists.forEach(({ el, lis }) => {
        if (el.hidden) return;
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        const k = Math.max(0, Math.min(1, (mid - r.top) / r.height));
        el.style.setProperty('--prog', `${(k * 100).toFixed(1)}%`);
        lis.forEach((li) => li.classList.toggle('on', li.getBoundingClientRect().top < mid));
      });
    };

    // CSS の組み上げ（約0.6秒）が終わってから、スクロールでの分解を受け付ける
    const assembleTimer = window.setTimeout(() => {
      assembled = true;
      onScroll();
    }, 700);

    // ---- 背景：アイソメトリックの格子（トップと同じ間隔） ----
    // 動かすのは FV が見えている間だけ。画面外・裏のタブでは止める。620px 以下は1枚だけ描いて動かさない
    let raf = 0;
    let running = false;
    let resizeGrid: (() => void) | null = null;
    let checkGrid: () => void = () => {};
    const cv = canvasRef.current;
    if (!RM && cv) {
      const cx = cv.getContext('2d');
      if (cx) {
        const DPR = Math.min(2, window.devicePixelRatio || 1);
        const SP = 92;
        const TAN = Math.tan(Math.PI / 6);
        const still = () => window.matchMedia('(max-width:620px)').matches;
        let W = 0;
        let H = 0;
        let segs: { a: string; o: number; life: number; sp: number }[] = [];
        let off = 0;

        const frame = () => {
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
        };

        const loop = () => {
          frame();
          raf = running ? requestAnimationFrame(loop) : 0;
        };
        const stop = () => {
          running = false;
          if (raf) cancelAnimationFrame(raf);
          raf = 0;
        };
        checkGrid = () => {
          const fvBottom = fvEl ? fvEl.offsetTop + fvEl.offsetHeight : window.innerHeight;
          const want = !document.hidden && !still() && window.scrollY < fvBottom;
          if (want && !running) {
            running = true;
            raf = requestAnimationFrame(loop);
          } else if (!want && running) {
            stop();
          }
        };

        resizeGrid = () => {
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
          if (!running) frame(); // 止まっている間も、静止した1枚は描いておく
          checkGrid();
        };

        window.addEventListener('resize', resizeGrid);
        document.addEventListener('visibilitychange', checkGrid);
        resizeGrid();
      }
    }

    const handleScroll = () => {
      sweep(); // 出現はrAFに依存させない
      checkGrid();
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);
    onScroll();
    sweep();
    const t1 = window.setTimeout(sweep, 120);
    const t2 = window.setTimeout(sweep, 600);

    // 狭い画面：資料請求の欄が見えている間は、下の固定バーを隠す（入口を同時に2つ見せない）
    const dl = root.querySelector('#dl');
    let io: IntersectionObserver | null = null;
    if (dl && 'IntersectionObserver' in window) {
      io = new IntersectionObserver((ents) => ents.forEach((en) => setDlVisible(en.isIntersecting)), {
        threshold: 0.08,
      });
      io.observe(dl);
    }

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (resizeGrid) window.removeEventListener('resize', resizeGrid);
      document.removeEventListener('visibilitychange', checkGrid);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(assembleTimer);
      running = false;
      if (raf) cancelAnimationFrame(raf);
      io?.disconnect();
    };
  }, []);

  // タブを切り替えたら、新しく見えた進め方を出現させ、線の位置を合わせる
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const panel = root.querySelector<HTMLElement>(`#steps-${stepTab}`);
    panel?.querySelectorAll<HTMLElement>('.rv:not(.in)').forEach((el) => {
      el.style.transitionDelay = `${(parseFloat(el.dataset.d || '0') * 0.055).toFixed(3)}s`;
      el.classList.add('in', 'on');
    });
    window.dispatchEvent(new Event('scroll'));
  }, [stepTab]);

  // ---- 送信 ----
  const validate = () => {
    const e: Partial<Record<Field, string>> = {};
    if (!form.company.trim()) e.company = '会社名・屋号を入力してください';
    if (!form.name.trim()) e.name = 'お名前を入力してください';
    if (!form.email.trim()) e.email = 'メールアドレスを入力してください';
    else if (!EMAIL_RE.test(form.email.trim()))
      e.email = 'メールアドレスの形を確かめてください（例：you@example.com）';
    return e;
  };

  const setField = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (k in errs) setErrs((x) => ({ ...x, [k]: undefined }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === 'sending') return;

    // 送る前に画面で確かめる。どこが足りないかを、その欄の下に日本語で出す
    const v = validate();
    setErrs(v);
    const first = (['company', 'name', 'email'] as Field[]).find((k) => v[k]);
    if (first) {
      setStatus('idle');
      setErrorMsg('');
      rootRef.current?.querySelector<HTMLInputElement>(`#doc-${first}`)?.focus();
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          company: form.company.trim(),
          name: form.name.trim(),
          email: form.email.trim(),
          service: service.slug,
          honeypot,
          timestamp: touchedAt.current || loadedAt.current,
        }),
      });
      let result: { error?: string; field?: string; docUrl?: string | null } = {};
      try {
        result = await res.json();
      } catch {
        /* 応答が JSON でない（通信の途中で切れた等） */
      }
      if (!res.ok) {
        if (result.field && ['company', 'name', 'email'].includes(result.field) && result.error) {
          setErrs({ [result.field as Field]: result.error });
          setStatus('idle');
          rootRef.current?.querySelector<HTMLInputElement>(`#doc-${result.field}`)?.focus();
          return;
        }
        throw new Error(result.error || '送信できませんでした。通信の状態を確かめて、もう一度お試しください。');
      }

      setStatus('done');

      // 計測：GA4 が読み込まれているときだけ送る（無ければ何もしない）。
      // 資料へ移動するときは、送り終わってから（または 800ms 後に）移動する。先に移ると数えられない
      const docUrl = result.docUrl;
      let moved = false;
      const go = () => {
        if (moved || !docUrl) return;
        moved = true;
        window.location.href = docUrl;
      };
      const g = gtagOf();
      if (g) {
        g('event', 'generate_lead', {
          service: service.slug,
          transport_type: 'beacon',
          event_callback: go,
        });
      }
      if (docUrl) window.setTimeout(go, g ? 800 : 0);
    } catch (err) {
      setStatus('error');
      setErrorMsg(
        err instanceof Error && err.message !== 'Failed to fetch'
          ? err.message
          : '送信できませんでした。通信の状態を確かめて、もう一度お試しください。'
      );
    }
  };

  // 見出しの下線を引く語で分割する
  const hlAt = service.title[1].indexOf(service.titleHighlight);
  const beforeHl = hlAt >= 0 ? service.title[1].slice(0, hlAt) : service.title[1];
  const afterHl = hlAt >= 0 ? service.title[1].slice(hlAt + service.titleHighlight.length) : '';

  const price = service.price;
  const monitor = price.kind === 'fixed' ? monitorHead(price.monitor) : null;
  // モニター価格はFVで1回だけ出す。リードに同じ金額が書いてあれば、FVの帯もパネルの帯も出さない（同じ画面に2回出さない）
  const monitorKey = monitor ? (monitor.split('：')[1] || monitor).split('（')[0] : '';
  const ledeHasMonitor = !!monitor && service.lede.join('').includes(monitorKey);
  const panelMonitor = monitor && !ledeHasMonitor ? monitor : null;

  // スマホの固定バーに出す一行。金額があるページは、払う金額（モニター価格があればそちら）の最安値。
  // 見積りのページは「お見積り」（金額の目安は出さない。代表の決定：金額を出すのは SNS運用代行（集客・採用。立ち上げだけのプランを含む）だけ）
  const payOf = (p: { amount: number; monitorAmount?: number }) => p.monitorAmount ?? p.amount;
  const minPlan =
    price.kind === 'fixed' && price.plans.length
      ? price.plans.reduce((a, b) => (payOf(b) < payOf(a) ? b : a))
      : null;
  const manyPlans = price.kind === 'fixed' && price.plans.length > 1;

  // セクション番号は、出すものだけで詰めて振る
  let secNo = 0;
  const sechead = (title: string) => (
    <div className="sechead rv left" data-d="0">
      <span className="n mono">{pad(++secNo)}</span>
      <h2 className="sp">{title}</h2>
    </div>
  );

  const fd = (n: number) => ({ 'data-fd': String(n), style: { '--fd': n } as React.CSSProperties });

  const flowLine = service.doc
    ? '送信するとすぐに資料が開きます。同じ資料のリンクをメールでもお送りします。'
    : 'ご入力のメールアドレスに、担当より1営業日以内に資料をお送りします。';

  const fieldProps = (k: Field) => ({
    'aria-invalid': errs[k] ? true : undefined,
    'aria-describedby': errs[k] ? `doc-${k}-err` : undefined,
  });

  // FV に出す実績：数字のあるものだけを最大2件（代表の経歴などを成果の隣に並べない）。
  // 数字のある実績が1件も無いページだけ、先頭の2件を、本文の1文を添えて出す
  const proofFig = service.proof.filter((p) => hasNum(p.t) || figureOf(p));
  const proofPlain = proofFig.length === 0;
  const proofTop = (proofPlain ? service.proof : proofFig).slice(0, 2);
  // 同じ情報はFVで1回だけ：実績の枠を出すときは、数字の欄の「実績」は出さない
  const facts = proofTop.length
    ? service.facts.filter((f) => f.k !== '実績')
    : service.facts;

  return (
    <div className={`lp svc${dlVisible || status === 'done' ? ' dlvis' : ''}`} ref={rootRef}>
      <canvas className="iso" ref={canvasRef} aria-hidden="true" />

      <SiteHeader here={service.label} inset />

      <div className="shell">
        {/* ==================== ファーストビュー ====================
            下の本文の要約。何を・いくらで・どうなる・証拠、までをこの1画面で */}
        <section className="fv">
          <div className="fvtxt">
            <div className="fvhead">
              <IsoCube />
              <p className="eyebrow rv up" {...fd(0)}>
                <i />
                <span>{service.label}</span>
              </p>
              <h1 className="rv up" {...fd(1)}>
                {service.title[0]}
                <br />
                {beforeHl}
                {hlAt >= 0 && <span className="hl">{service.titleHighlight}</span>}
                {afterHl}
              </h1>
              <p className="lede rv up" {...fd(2)}>
                {service.summary}
              </p>
            </div>

            <dl className={`facts n${facts.length} rv up`} {...fd(3)}>
              {facts.map((f) => {
                const txt = !/\d/.test(f.v);
                const wide = txt || (f.v + f.unit).length > 14;
                return (
                  <div className={`f${wide ? ' wide' : ''}`} key={f.k}>
                    <dt className="k">{f.k}</dt>
                    <dd className={`v ${txt ? 'txt' : 'num'}`}>
                      {f.v}
                      {f.unit && <small>{f.unit}</small>}
                    </dd>
                  </div>
                );
              })}
            </dl>
            {proofTop.length > 0 && (
              <a className={`proofline rv up${proofPlain ? ' plain' : ''}`} {...fd(4)} href="#proof">
                <span className="pk">当社の実績</span>
                <span className="pl">
                  {proofTop.map((p, i) => {
                    const fig = figureOf(p);
                    const lead = proofPlain ? leadSentence(p.d) : null;
                    return (
                      <span className="it" key={i}>
                        {fig ? (
                          <>
                            <span className="ft">{markNum(fig)}</span>
                            <span className="tt">{p.t}</span>
                          </>
                        ) : (
                          <>
                            <span className={hasNum(p.t) ? 'ft' : 'tt0'}>{markNum(p.t)}</span>
                            {lead && <span className="tt">{lead}</span>}
                          </>
                        )}
                      </span>
                    );
                  })}
                </span>
              </a>
            )}

            <ul className="points rv up" {...fd(5)}>
              {service.points.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>

          {/* 読み終えた目を右のパネルへ渡す帯。押すと資料請求の欄へ移る（広い画面だけ。狭い画面では下の固定バーが入口） */}
          <a className="handoff rv up" {...fd(6)} href="#dl">
            <span className="tx">
              <span className="k">まだ決めなくて大丈夫です。</span>
              <span className="t">まずは右の資料をご覧ください</span>
            </span>
            <span className="ar" aria-hidden="true">→</span>
          </a>
        </section>

        {/* ==================== 資料請求パネル ====================
            トップと同じ置き方：画面の右端に縦いっぱい。最初から表示して動かさない */}
        <aside className="rail" id="dl" aria-label="資料請求">
          <form className="card" onSubmit={onSubmit} onFocus={onFirstTouch} onInput={onFirstTouch} noValidate>
            <div className="top">
              <div className="k">無料の資料</div>
              <h2>{service.docPitch.title}</h2>
              <ul className="pitch">
                {service.docPitch.items.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className="bd">
              {panelMonitor && status !== 'done' && <p className="mon">{panelMonitor}</p>}
              {status === 'done' ? (
                <div className="done" role="status">
                  <p className="dt">送信しました</p>
                  <p className="dd">
                    {service.doc
                      ? '資料が開かない場合は、お送りしたメールのリンクからご覧ください。'
                      : 'ご入力のメールアドレス宛に、担当より1営業日以内に資料をお送りします。'}
                  </p>
                  <p className="dd2">
                    届かないときは、迷惑メールのフォルダもご確認ください。
                    <br />
                    お問い合わせ：{company.email}
                  </p>
                </div>
              ) : (
                <>
                  <div className={`fld${errs.company ? ' bad' : ''}`}>
                    <label htmlFor="doc-company">会社名・屋号</label>
                    <input
                      id="doc-company"
                      type="text"
                      required
                      autoComplete="organization"
                      placeholder="株式会社◯◯"
                      value={form.company}
                      onChange={(e) => setField('company', e.target.value)}
                      {...fieldProps('company')}
                    />
                    {errs.company && (
                      <p className="ferr" id="doc-company-err">
                        {errs.company}
                      </p>
                    )}
                  </div>
                  <div className={`fld${errs.name ? ' bad' : ''}`}>
                    <label htmlFor="doc-name">お名前</label>
                    <input
                      id="doc-name"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="山田 太郎"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                      {...fieldProps('name')}
                    />
                    {errs.name && (
                      <p className="ferr" id="doc-name-err">
                        {errs.name}
                      </p>
                    )}
                  </div>
                  <div className={`fld${errs.email ? ' bad' : ''}`}>
                    <label htmlFor="doc-email">メールアドレス</label>
                    <input
                      id="doc-email"
                      type="email"
                      required
                      autoComplete="email"
                      inputMode="email"
                      placeholder="you@example.com"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                      {...fieldProps('email')}
                    />
                    {errs.email && (
                      <p className="ferr" id="doc-email-err">
                        {errs.email}
                      </p>
                    )}
                  </div>

                  {/* 任意の2つは畳んでおく。必須の3つだけで送れる */}
                  <details className="more">
                    <summary>サイトのURL・電話番号も伝える（任意）</summary>
                    <div className="fld">
                      <label htmlFor="doc-website">サイトかSNSのURL</label>
                      <input
                        id="doc-website"
                        type="text"
                        inputMode="url"
                        autoComplete="url"
                        placeholder="example.com／instagram.com/…"
                        value={form.website}
                        onChange={(e) => setField('website', e.target.value)}
                      />
                    </div>
                    <div className="fld">
                      <label htmlFor="doc-phone">電話番号</label>
                      <input
                        id="doc-phone"
                        type="tel"
                        autoComplete="tel"
                        placeholder="000-0000-0000"
                        value={form.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                      />
                    </div>
                  </details>

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
                    <span>{status === 'sending' ? '送信中…' : '資料をもらう（無料）'}</span>
                  </button>
                  {status === 'error' && (
                    <div className="err" role="alert">
                      <p>{errorMsg}</p>
                      <p className="errmail">
                        メールでも受け付けています：
                        <a href={`mailto:${company.email}`}>{company.email}</a>
                      </p>
                    </div>
                  )}
                  <p className="flow">{flowLine}</p>
                  <p className="fnote">ご入力の内容は、資料の送付とご連絡にのみ使います。</p>
                </>
              )}
            </div>
          </form>
        </aside>

        {/* ==================== 本文 ====================
            FVで判断できなかった人が読む場所。削らずに書く。
            証拠（実績）は「何が変わるか」の直後に置く。料金より前に信じる理由を渡す */}
        <main className="body">
          {/* 最初の画面から下ろした説明と用語。検索で読まれる言葉はここに残す */}
          <section className="sec intro">
            {service.lede.map((line, i) => (
              <p key={i} className="introp">
                {line}
              </p>
            ))}
            {service.termline && <p className="termline">{service.termline}</p>}
          </section>

          <section className="sec">
            {sechead('こんな状態ではありませんか')}
            <ul className="probs">
              {service.problems.map((p, i) => (
                <li key={i} className="rv up" data-d={String(i)}>
                  <span className="q">{pad(i + 1)}</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
            {service.concept ? (
              <div className="concept rv tilt" data-d="0">
                <span className="ck">考え方</span>
                <b>{service.concept.t}</b>
                <p>{service.concept.d}</p>
              </div>
            ) : (
              <div className="turn rv up" data-d="0">
                このサービスで、こうなります
              </div>
            )}
          </section>

          <section className="sec">
            {sechead('何が変わるか')}
            <ul className="gains">
              {service.gains.map((g, i) => (
                <li key={i} className="rv up" data-d={String(i)}>
                  <span className="n mono">{pad(i + 1)}</span>
                  <span>
                    <b>{g.t}</b>
                    <span>{g.d}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {service.proof.length > 0 && (
            <section className="sec" id="proof">
              {sechead('実績')}
              <div className="proofs">
                {service.proof.map((p, i) => (
                  <article className="pf rv up" data-d={String(i)} key={p.t}>
                    <h3>{markNum(p.t)}</h3>
                    <p>{markNum(p.d)}</p>
                  </article>
                ))}
              </div>
              {service.proofNote && (
                <p className="sub2 rv up" data-d="0">
                  {service.proofNote}
                </p>
              )}
            </section>
          )}

          <section className="sec">
            {sechead('何をお渡しするか')}
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

          {service.excludes.length > 0 && (
            <section className="sec">
              {sechead('含まないもの')}
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
          )}

          {/* 斜めに切った帯：進め方。プランで違うときは切り替える */}
          <div className="stepband">
            <section className="sec">
              {sechead('進め方')}
              {service.steps.length > 1 && (
                <div className="seg rv up" data-d="1" role="tablist" aria-label="プランを選ぶ">
                  {service.steps.map((g, i) => (
                    <button
                      key={i}
                      type="button"
                      role="tab"
                      id={`steps-tab-${i}`}
                      aria-selected={stepTab === i}
                      aria-controls={`steps-${i}`}
                      tabIndex={stepTab === i ? 0 : -1}
                      className={stepTab === i ? 'on' : ''}
                      onClick={() => setStepTab(i)}
                      onKeyDown={(e) => {
                        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                        e.preventDefault();
                        const n = service.steps.length;
                        const next = (i + (e.key === 'ArrowRight' ? 1 : n - 1)) % n;
                        setStepTab(next);
                        document.getElementById(`steps-tab-${next}`)?.focus();
                      }}
                    >
                      {g.label ?? `プラン${i + 1}`}
                    </button>
                  ))}
                </div>
              )}
              {service.steps.map((g, gi) => (
                <ol
                  key={gi}
                  className="steps"
                  id={`steps-${gi}`}
                  role={service.steps.length > 1 ? 'tabpanel' : undefined}
                  aria-labelledby={service.steps.length > 1 ? `steps-tab-${gi}` : undefined}
                  hidden={gi !== stepTab}
                >
                  {g.items.map((s, i) => (
                    <li key={i} className="rv up" data-d={String(i)}>
                      <span className="n">{i + 1}</span>
                      <span>
                        <b>{s.t}</b>
                        <span>{s.d}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              ))}
            </section>
          </div>

          <section className="sec" id="price">
            {sechead('料金')}
            {price.kind === 'fixed' ? (
              <>
                <div className={`plans n${Math.min(price.plans.length, 3)}`}>
                  {price.plans.map((p, i) => (
                    <div className="plan rv tilt" data-d={String(i)} key={p.name}>
                      <div className="pn">{p.name}</div>
                      {/* 金額はカウントアップさせない。途中で止まると誤った金額が出る */}
                      {p.monitorAmount != null ? (
                        <>
                          <div className="pp was">
                            <span className="lb">定価</span>
                            {man(p.amount)}
                            <small>{p.unit}</small>
                          </div>
                          <div className="pp">
                            <span className="lb">モニター</span>
                            {man(p.monitorAmount)}
                            <small>{p.unit}</small>
                          </div>
                        </>
                      ) : (
                        <div className="pp">
                          {man(p.amount)}
                          <small>{p.unit}</small>
                        </div>
                      )}
                      {p.note && <p className="pnote1">{p.note}</p>}
                      <ul>
                        {p.items.map((x) => (
                          <li key={x}>{x}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                {price.monitor && (
                  <p className="monitor rv up" data-d="0">
                    {price.monitor}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="sub2 rv up" data-d="1">
                  内容をうかがってお見積りします。金額は、次のことで決まります。
                </p>

                <div className="factors">
                  {price.factors.map((f, i) => (
                    <div className="row rv up" data-d={String(i)} key={f.t}>
                      <span className="n mono">{pad(i + 1)}</span>
                      <div>
                        <div className="t">{f.t}</div>
                        <div className="d">{f.d}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            <ul className="pnotes rv up" data-d="0">
              {price.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
              <li>
                キャンセルの取り扱いは <Link href="/terms">利用規約</Link> 第6条をご確認ください。
              </li>
            </ul>
          </section>

          <section className="sec">
            {sechead('よくある質問')}
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
              {sechead('お客様の声')}
              <div className="voice rv tilt" data-d="0">
                <div className="who">{service.voice.who}</div>
                <q>{service.voice.quote}</q>
                <div className="meta">{service.voice.meta}</div>
              </div>
            </section>
          )}
        </main>
      </div>

      {/* ==================== フッター ====================
          法務3ページへのリンクは消さない（決済の審査で見られる） */}
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
          {/* サイトの案内（サービス・会社案内・お問い合わせ）と法務3ページ。
              法務3ページは消さない（決済の審査で見られる） */}
          <SiteFooterNav />
          <p className="cp" suppressHydrationWarning>
            &copy; {new Date().getFullYear()} DP-GUILD. All rights reserved.
          </p>
        </div>
      </footer>

      {/* スマホ用の固定バー。金額のあるページは最安値、見積りのページは「お見積り」。
          資料請求の欄が見えている間と、送信が終わった後は隠す */}
      <div className="mbar" aria-hidden={dlVisible || status === 'done' ? true : undefined}>
        {minPlan ? (
          <div className="p">
            {minPlan.monitorAmount != null && <span className="lb">モニター</span>}
            {man(payOf(minPlan))}
            <span className="u">円{manyPlans ? '〜' : ''}</span>
            <small>{minPlan.unit.replace(/^円/, '')} ／ 資料は無料</small>
          </div>
        ) : (
          <div className="p txt">
            お見積り
            <small>資料は無料でお送りします</small>
          </div>
        )}
        <a
          href="#dl"
          tabIndex={dlVisible || status === 'done' ? -1 : undefined}
          onClick={() => gtagOf()?.('event', 'mbar_click', { service: service.slug })}
        >
          資料をもらう
        </a>
      </div>
    </div>
  );
}
