'use client';

// 検証パッケージ LP（1から作り直し 2026-09-26）
//
// 土台は石井さんのデザインプロンプト（docs/DESIGN_PROMPT.md）本文：
//   「当社の技術力そのものを見せる作品。開いた瞬間に『この会社は作れる』と分かるもの」
//   ロゴの不可能立体を設計思想に。非対称・はみ出し・重ね・斜めの境界。アニメーションが主役。
// LP として変えたのは中身だけ（入口→証拠→困りごと→仕組み→約束→手に入るもの→価格→相談）。
// 動きは「次に見せたいものへ目を連れて行く」ために置く（石井さん方針）。
//   立方体が組み上がる → 見出しが押し出される → 「お金を払って」に光が走る → ボタン
//   スクロールで立方体が分解し、各面が飛んでいく。仕組みの節は、スクロールで 9枚 → 3枚 → 1枚 と絞られる。

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Script from 'next/script';
import { useRouter } from 'next/navigation';
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
  type Variants,
} from 'framer-motion';
import SiteHeader from '@/components/SiteHeader';
import { getLpPost, type LpPost, type LpPostStatus } from '@/lib/lp-posts';

// ---- 定数。ここだけ変えれば表示が変わる ----
const LP = {
  price: null as string | null, // 未設定なら「価格はご相談時にお伝えします」
  term: null as string | null,
};

// 証拠の画像に添える文。投稿ごとの状態で変わる。「反応が出た」は本当に出た投稿にしか書かない
const PROOF_TEXT: Record<LpPostStatus, string> = {
  testing: 'この投稿は、|いま試している最中です。\n反応の数字を見て、|広告にするかどうかを|決めます。',
  selected: 'この投稿は、|試した中で|反応が出たものです。\nこれから広告にします。',
  ad: 'この広告は、|試した投稿の中から|数字で選ばれたものです。',
};

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
    gtag?: (...args: unknown[]) => void;
    clarity?: (...args: unknown[]) => void;
  }
}

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;
type UtmKey = (typeof UTM_KEYS)[number];
type Tracking = Record<UtmKey, string> & { landing: string };
const emptyTracking: Tracking = { utm_source: '', utm_medium: '', utm_campaign: '', utm_content: '', landing: '' };

const EASE = [0.19, 1, 0.22, 1] as const;

// ============================================================
// 本文の改行：1文ずつ行を分け、語の途中では折り返さない
//   "\n" … ここで行を分ける（1文ごと）
//   "|"   … 画面が狭いときだけ、ここで折り返してよい（意味の切れ目）
//   行頭の "**" … その行を太字にする
// ============================================================
function Tx({ s }: { s: string }) {
  return (
    <>
      {s.split('\n').map((line, i) => {
        const bold = line.startsWith('**');
        const body = bold ? line.slice(2) : line;
        const parts = body.split('|').map((ph, j) => (
          <span className="ph" key={j}>
            {ph}
          </span>
        ));
        return (
          <span className="ln" key={i}>
            {bold ? <b>{parts}</b> : parts}
          </span>
        );
      })}
    </>
  );
}

// ============================================================
// 文字：1文字ずつ、マスクの下から押し出す
// ============================================================
const charV: Variants = {
  hidden: { y: '112%' },
  show: (d: number) => ({ y: '0%', transition: { delay: d, duration: 0.75, ease: EASE } }),
};

function Chars({ text, from = 0, base = 0, step = 0.028 }: { text: string; from?: number; base?: number; step?: number }) {
  return (
    <>
      {Array.from(text).map((c, i) => (
        <span className="ch" key={i}>
          <motion.i variants={charV} custom={base + (from + i) * step}>
            {c}
          </motion.i>
        </span>
      ))}
    </>
  );
}

// 見出し。視界に入ったら押し出す
function Heading({ text, className, rm }: { text: string[]; className?: string; rm: boolean }) {
  let n = 0;
  return (
    <motion.h2 className={className} initial={rm ? false : 'hidden'} whileInView="show" viewport={{ once: true, margin: '0px 0px -12% 0px' }}>
      {text.map((t, i) => {
        const from = n;
        n += t.length;
        return (
          <span className="seg" key={i}>
            <Chars text={t} from={from} />
          </span>
        );
      })}
    </motion.h2>
  );
}

// 要素の出現。方向・距離・傾きを変える（単純なフェードにしない）
function Rise({
  children,
  className,
  x = 0,
  y = 36,
  r = 0,
  d = 0,
  rm,
  as = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  x?: number;
  y?: number;
  r?: number;
  d?: number;
  rm: boolean;
  as?: 'div' | 'li';
}) {
  const M = as === 'li' ? motion.li : motion.div;
  return (
    <M
      className={className}
      initial={rm ? false : { opacity: 0, x, y, rotate: r }}
      whileInView={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ type: 'spring', stiffness: 90, damping: 16, mass: 0.9, delay: d }}
    >
      {children}
    </M>
  );
}

// ============================================================
// ロゴの不可能立体：線が1本ずつ引かれて組み上がり、スクロールで分解して飛ぶ
// ============================================================
type Seg = { d: string; thin?: boolean; hide?: boolean };
const FACES: { fx: number; fy: number; segs: Seg[] }[] = [
  { fx: 0.2, fy: -1.1, segs: [{ d: 'M250 60 L423.2 160 L250 260 L76.8 160 Z' }, { d: 'M250 102 L350.5 160 L250 218 L149.5 160 Z', thin: true }] },
  { fx: -1.1, fy: 0.5, segs: [{ d: 'M76.8 160 L250 260 L250 460 L76.8 360 Z' }, { d: 'M113.2 223 L213.6 281 L213.6 397 L113.2 339 Z', thin: true }] },
  { fx: 1.2, fy: 0.3, segs: [{ d: 'M250 260 L423.2 160 L423.2 360 L250 460 Z' }, { d: 'M286.4 281 L386.8 223 L386.8 339 L286.4 397 Z', thin: true }] },
  {
    fx: 0.1,
    fy: 1.5,
    segs: [
      { d: 'M250 218 L250 302', hide: true },
      { d: 'M250 218 L250 302', thin: true },
      { d: 'M213.6 281 L250 302 L286.4 281', hide: true },
      { d: 'M213.6 281 L250 302 L286.4 281', thin: true },
    ],
  },
  { fx: -0.4, fy: -1.3, segs: [{ d: 'M330 172 L250 218 L170 172', hide: true }, { d: 'M330 172 L250 218 L170 172', thin: true }] },
];

function CubeFace({ p, fx, fy, children }: { p: MotionValue<number>; fx: number; fy: number; children: React.ReactNode }) {
  const x = useTransform(p, [0, 1], [0, fx * 360]);
  const y = useTransform(p, [0, 1], [0, fy * 300]);
  const rotate = useTransform(p, [0, 1], [0, fx * 34 + fy * 10]);
  const opacity = useTransform(p, [0, 0.55, 0.9], [1, 0.85, 0]);
  return <motion.g style={{ x, y, rotate, opacity, transformBox: 'fill-box', transformOrigin: 'center' }}>{children}</motion.g>;
}

function Cube({ p, rm }: { p: MotionValue<number>; rm: boolean }) {
  let k = 0;
  return (
    <svg className="k-cube-svg" viewBox="0 0 500 530" aria-hidden="true">
      <defs>
        <linearGradient id="kcubeg" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#0FBFB0" />
          <stop offset="42%" stopColor="#3560E0" />
          <stop offset="74%" stopColor="#7A45E8" />
          <stop offset="100%" stopColor="#C267F0" />
        </linearGradient>
      </defs>
      {FACES.map((f, i) => (
        <CubeFace p={p} fx={f.fx} fy={f.fy} key={i}>
          {f.segs.map((s, j) => {
            if (s.hide) return <path className="hide" d={s.d} key={j} />;
            const order = k++;
            return (
              <motion.path
                key={j}
                d={s.d}
                className={s.thin ? 'thin' : undefined}
                initial={rm ? false : { pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ delay: 0.05 + order * 0.07, duration: 0.6, ease: [0.3, 1, 0.4, 1] }}
              />
            );
          })}
        </CubeFace>
      ))}
    </svg>
  );
}

// ============================================================
// 背景：アイソメトリックの線が生成・消滅を繰り返す。スクロールの速さで密度が上がる
// ============================================================
function useIsoGrid(ref: React.RefObject<HTMLCanvasElement | null>, rm: boolean) {
  useEffect(() => {
    const cv = ref.current;
    if (rm || !cv) return;
    const cx = cv.getContext('2d');
    if (!cx) return;
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    const SP = 84;
    const TAN = Math.tan(Math.PI / 6);
    let W = 0;
    let H = 0;
    let off = 0;
    let vel = 0;
    let lastY = window.scrollY;
    let segs: { a: 'x' | 'r' | 'l'; o: number; life: number; sp: number }[] = [];
    const resize = () => {
      W = cv.clientWidth;
      H = cv.clientHeight;
      cv.width = W * DPR;
      cv.height = H * DPR;
      cx.setTransform(DPR, 0, 0, DPR, 0, 0);
      segs = [];
      for (let i = -30; i < 60; i++) {
        (['x', 'r', 'l'] as const).forEach((a) => segs.push({ a, o: i * SP, life: Math.random(), sp: 0.0016 + Math.random() * 0.004 }));
      }
    };
    const onScroll = () => {
      const y = window.scrollY;
      vel = vel * 0.8 + Math.abs(y - lastY) * 0.2;
      lastY = y;
    };
    let raf = 0;
    const draw = () => {
      cx.clearRect(0, 0, W, H);
      off = (off + 0.14) % SP;
      const dens = Math.min(1, 0.5 + vel * 0.035);
      for (let i = 0; i < segs.length; i++) {
        const s = segs[i];
        s.life += s.sp * (1 + vel * 0.02);
        if (s.life > 1) s.life -= 1;
        const a = Math.sin(s.life * Math.PI);
        if (a < 0.03) continue;
        const al = a * dens * 0.3;
        cx.strokeStyle =
          i % 7 === 0 ? `rgba(15,191,176,${al * 1.8})` : i % 11 === 0 ? `rgba(122,69,232,${al * 1.6})` : `rgba(40,70,140,${al})`;
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
      vel *= 0.94;
      raf = requestAnimationFrame(draw);
    };
    resize();
    draw();
    window.addEventListener('resize', resize);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
    };
  }, [ref, rm]);
}

// ============================================================
// 仕組み：スクロールで 9枚 → 3枚 → 1枚 に絞られる
// ============================================================
const FINALISTS = [1, 5, 6];
const WINNER = 5;

function Tile({ i, p, post }: { i: number; p: MotionValue<number>; post?: LpPost }) {
  const fin = FINALISTS.includes(i);
  const win = i === WINNER;
  const opacity = useTransform(p, win ? [0, 1] : fin ? [0.5, 0.68] : [0.2, 0.4], win ? [1, 1] : [1, 0.12]);
  const scale = useTransform(p, win ? [0.62, 0.92] : fin ? [0.5, 0.68] : [0.2, 0.4], win ? [1, 1.34] : [1, 0.84]);
  const ring = useTransform(p, fin ? [0.36, 0.48] : [0, 1], fin ? [0, 1] : [0, 0]);
  const tag = useTransform(p, [0.8, 0.92], [0, 1]);
  return (
    <motion.div className={`k-tile${win ? ' win' : ''}`} style={{ opacity, scale, zIndex: win ? 3 : fin ? 2 : 1 }}>
      <motion.span className="ring" style={{ opacity: ring }} />
      {win && post ? (
        <Image src={post.src} alt="" width={1080} height={1350} unoptimized />
      ) : (
        <>
          <i className="b1" />
          <i className="b2" />
        </>
      )}
      {win && (
        <motion.b className="adtag" style={{ opacity: tag }}>
          広告へ
        </motion.b>
      )}
    </motion.div>
  );
}

function Funnel({ post, rm }: { post?: LpPost; rm: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.35'] });
  const sp = useSpring(scrollYProgress, { stiffness: 70, damping: 20, mass: 0.6 });
  const done = useTransform(scrollYProgress, () => 1);
  const p = rm ? done : sp;
  const [stage, setStage] = useState(rm ? 2 : 0);
  useMotionValueEvent(sp, 'change', (v) => {
    if (rm) return;
    setStage(v < 0.36 ? 0 : v < 0.66 ? 1 : 2);
  });
  const line = useTransform(p, [0, 0.95], [0, 1]);
  const steps = [
    { t: '試す', s: '言い方や見せ方の違う投稿を、|お客様のInstagramアカウントに、|広告費をかけずに|いくつも出す' },
    { t: '選ぶ', s: '保存・コメント・|プロフィールへの移動など、|反応の数字で選ぶ' },
    { t: '出す', s: '反応が出た投稿だけを、|広告にする' },
  ];
  return (
    <div className="k-funnel" ref={ref}>
      <div className="k-funnel-stick">
        <div className="k-tiles" aria-hidden="true">
          {Array.from({ length: 9 }).map((_, i) => (
            <Tile i={i} p={p} post={post} key={i} />
          ))}
        </div>
        <ol className="k-steps">
          <motion.span className="k-line" style={{ scaleY: line }} aria-hidden="true" />
          {steps.map((s, i) => (
            <li className={`k-step${stage === i ? ' on' : ''}${stage > i ? ' done' : ''}`} key={s.t}>
              <span className="n" aria-hidden="true">
                {i + 1}
              </span>
              <div>
                <b>{s.t}</b>
                <span>
                  <Tx s={s.s} />
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ============================================================
// 本体
// ============================================================
export default function KenshoPage() {
  const router = useRouter();
  const rm = !!useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fvRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const [sent, setSent] = useState<'idle' | 'sending' | 'error'>('idle');
  const [msg, setMsg] = useState('');
  const [form, setForm] = useState({ company: '', name: '', email: '', content: '' });
  const [fieldErr, setFieldErr] = useState<{ company?: string; name?: string; email?: string }>({});
  const [honeypot, setHoneypot] = useState('');
  const [tracking, setTracking] = useState<Tracking>(emptyTracking);
  const [post, setPost] = useState<LpPost | undefined>(undefined);
  const [bar, setBar] = useState(false);
  const startedAt = useRef(0);

  useIsoGrid(canvasRef, rm);

  // 立方体の分解は、ファーストビューを抜けるまでのスクロール量で決める
  const { scrollYProgress: fvP } = useScroll({ target: fvRef, offset: ['start start', 'end start'] });
  const cubeP = useSpring(fvP, { stiffness: 80, damping: 22, mass: 0.5 });
  // 見出しと立方体を別々の速度・別々の方向に動かす（奥行き）
  const h1Y = useTransform(fvP, [0, 1], [0, -60]);
  const cubeY = useTransform(fvP, [0, 1], [0, 90]);

  // 経路と投稿ID
  useEffect(() => {
    startedAt.current = Date.now();
    const sp = new URLSearchParams(window.location.search);
    const next: Tracking = { ...emptyTracking };
    UTM_KEYS.forEach((k) => {
      next[k] = (sp.get(k) ?? '').slice(0, 100);
    });
    const KEY = 'kensho_utm';
    try {
      if (next.utm_source) sessionStorage.setItem(KEY, JSON.stringify(next));
      else {
        const saved = sessionStorage.getItem(KEY);
        if (saved) Object.assign(next, JSON.parse(saved) as Partial<Tracking>);
      }
    } catch {
      /* 使えない環境では何もしない */
    }
    if (next.utm_source && !next.utm_medium) next.utm_medium = next.utm_source === 'ad' ? 'paid' : 'organic';
    if (next.utm_source && !next.utm_campaign) next.utm_campaign = 'kensho';
    next.landing = (window.location.pathname + window.location.search).slice(0, 300);
    setTracking(next);
    setPost(getLpPost(next.utm_content));
  }, []);

  // 追従ボタン：入口の相談ボタンが出たあとに現れ、以降はずっと出しておく（石井さん 2026-09-26）。
  // 1画面目の目の順番（立方体 → 見出し → ボタン）を崩さないよう、出すのは入口の演出が終わってから
  useEffect(() => {
    if (rm) {
      setBar(true);
      return;
    }
    const t = window.setTimeout(() => setBar(true), 2800);
    return () => window.clearTimeout(t);
  }, [rm]);

  // フォームが画面に見えている間だけ、追従ボタンを引っ込める（送信ボタンに重ならないように）
  const [formInView, setFormInView] = useState(false);
  useEffect(() => {
    const el = formRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setFormInView(e.isIntersecting), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const barOn = bar && !formInView;

  const goForm = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const el = formRef.current;
    if (!el) return;
    el.scrollIntoView({ behavior: rm ? 'auto' : 'smooth', block: 'start' });
    window.setTimeout(() => document.getElementById('k-company')?.focus({ preventScroll: true }), rm ? 0 : 650);
  };

  const validate = () => {
    const errs: { company?: string; name?: string; email?: string } = {};
    if (!form.company.trim()) errs.company = '会社名・屋号を入力してください';
    if (!form.name.trim()) errs.name = 'お名前を入力してください';
    if (!form.email.trim()) errs.email = 'メールアドレスを入力してください';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = 'メールアドレスの形式を確認してください';
    setFieldErr(errs);
    const first = errs.company ? 'k-company' : errs.name ? 'k-name' : errs.email ? 'k-email' : null;
    if (first) document.getElementById(first)?.focus();
    return !first;
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sent === 'sending') return;
    if (!validate()) return;
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
        throw new Error(res.status === 400 && r.error ? r.error : '送信に失敗しました。時間をおいて、もう一度お試しください。');
      }
      window.fbq?.('track', 'Lead', { content_name: tracking.utm_content || 'profile', content_category: tracking.utm_source || 'direct' });
      // Googleアナリティクス：LP専用の申込イベント（サイト全体のお問い合わせの計測とは混ぜない）
      window.gtag?.('event', 'kensho_lead', {
        route: tracking.utm_source || 'direct',
        post_id: tracking.utm_content || 'none',
      });
      // Clarity：申込した人の録画に印を付ける
      window.clarity?.('event', 'kensho_lead');
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

  // 入口の時間軸（秒）。立方体 → 見出し → 光 → 本文 → ボタン
  const T = { h1: 0.55, hl: 1.45, lede: 1.75, cta: 2.05 };
  const H1 = ['効くかどうか', '分からない広告に、'];
  const HL = 'お金を払って';
  const TAIL = 'いませんか。';
  const n1 = H1[0].length;
  const n2 = n1 + H1[1].length;
  const n3 = n2 + HL.length;

  return (
    <div className="lp kensho">
      <canvas className="k-iso" ref={canvasRef} aria-hidden="true" />
      {PIXEL_ID && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(PIXEL_ID)});fbq('track','PageView');`}
        </Script>
      )}

      {/* Microsoft Clarity（ヒートマップ・操作の録画）。サイト共通のレイアウトは他の作業と衝突しやすいので、LPの中だけに置く */}
      <Script id="ms-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","yq8grqz6mv");`}
      </Script>

      <SiteHeader here="検証パッケージ" />

      {/* ==================== 1. 入口 ==================== */}
      <section className="k-fv" ref={fvRef}>
        <motion.div className="k-cube" style={{ y: rm ? 0 : cubeY }}>
          <Cube p={cubeP} rm={rm} />
        </motion.div>

        <motion.div className="k-fvtxt" style={{ y: rm ? 0 : h1Y }} initial={rm ? false : 'hidden'} animate="show">
          <motion.p
            className="k-kicker"
            variants={{ hidden: { opacity: 0, x: -24 }, show: { opacity: 1, x: 0, transition: { delay: 0.35, duration: 0.6, ease: EASE } } }}
          >
            <i aria-hidden="true" />
            Instagram広告を出す前の、検証パッケージ
          </motion.p>
          <h1 className="k-h1">
            <span className="seg">
              <Chars text={H1[0]} base={T.h1} />
            </span>
            <span className="seg">
              <Chars text={H1[1]} from={n1} base={T.h1} />
            </span>
            <span className="seg">
              <span className="k-hl">
                <Chars text={HL} from={n2} base={T.h1} />
                <motion.span
                  className="k-hlbar"
                  aria-hidden="true"
                  variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { delay: T.hl, duration: 0.8, ease: EASE } } }}
                />
                <motion.span
                  className="k-scan"
                  aria-hidden="true"
                  variants={{
                    hidden: { x: '-120%', opacity: 0 },
                    show: { x: '120%', opacity: [0, 1, 0], transition: { delay: T.hl + 0.1, duration: 0.9, ease: 'easeInOut' } },
                  }}
                />
              </span>
              <Chars text={TAIL} from={n3} base={T.h1} />
            </span>
          </h1>
          <motion.p
            className="k-lede"
            variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0, transition: { delay: T.lede, duration: 0.6, ease: EASE } } }}
          >
            出す前に、反応が出るかどうかを確かめる。
            <br />
            反応が出た投稿だけを、広告にする。
            <br />
            <span className="nb">中小企業向けの、</span>単発の検証サービスです。
          </motion.p>
          <motion.div
            className="k-ctawrap"
            variants={{
              hidden: { opacity: 0, y: 26, scale: 0.96 },
              show: { opacity: 1, y: 0, scale: 1, transition: { delay: T.cta, type: 'spring', stiffness: 160, damping: 14 } },
            }}
          >
            <a href="#k-form" className="k-cta" onClick={goForm}>
              <span className="k-cta-shine" aria-hidden="true" />
              <span className="t">無料で相談する</span>
              <span className="ar" aria-hidden="true">
                →
              </span>
            </a>
            <p className="k-ctanote">電話番号は聞きません。メールで返信します。</p>
          </motion.div>
        </motion.div>
        <div className="k-cut" aria-hidden="true" />
      </section>

      <main className="k-main">
        {/* ==================== 2. 証拠 ==================== */}
        <section className="k-sec k-proof">
          <div className="k-proof-txt">
            <Heading text={['Instagramの投稿から', '来ましたよね。']} className="k-h2" rm={rm} />
            <Rise rm={rm} y={24} d={0.2}>
              <p className="k-body">
                <Tx s={'あなたが見た投稿は、|言い方の違う投稿を|いくつも試している|中の1枚です。\n反応の数字で選び、|反応が出た投稿だけを|広告にする。\n**このInstagramアカウント自体が、|そのやり方の実演です。'} />
              </p>
            </Rise>
            {post && (
              <Rise rm={rm} y={16} d={0.3}>
                <p className="k-proof-cap"><Tx s={PROOF_TEXT[post.status ?? 'testing']} /></p>
              </Rise>
            )}
          </div>
          <Rise className="k-phone" rm={rm} x={80} y={40} r={9} d={0.1}>
            <div className="k-phone-in">
              <div className="k-phone-bar" aria-hidden="true">
                <span />
                <b>DP-GUILD</b>
              </div>
              <div className="k-feed">
                {Array.from({ length: 9 }).map((_, i) => {
                  const me = i === 4;
                  return (
                    <motion.div
                      className={`k-cell${me ? ' me' : ''}`}
                      key={i}
                      initial={rm ? false : { opacity: 0, scale: 0.6, rotate: (i % 3) * 6 - 6 }}
                      whileInView={{ opacity: me ? 1 : 0.55, scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.35 + (me ? 0.75 : i * 0.05), type: 'spring', stiffness: 140, damping: 15 }}
                    >
                      {me && post ? <Image src={post.src} alt={post.alt} width={1080} height={1350} unoptimized /> : <i />}
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <motion.div
              className="k-pin"
              initial={rm ? false : { opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 1.25, duration: 0.6, ease: EASE }}
            >
              <span className="dot" aria-hidden="true" />
              {post ? 'あなたが見た1枚' : '試している中の1枚'}
            </motion.div>
          </Rise>
        </section>

        {/* ==================== 3. 困りごと（濃い面・斜めの境界） ==================== */}
        <section className="k-sec k-pain">
          <div className="k-pain-in">
            <Heading text={['広告を出したいけど、', '出せない。']} className="k-h2 light" rm={rm} />
            <ul className="k-pains">
              {[
                ['効果があるか分からないから、', '踏み切れない'],
                ['出してみたけど、', '当たったのかどうかも分からなかった'],
                ['広告代理店に頼むほどの', '予算はない'],
              ].map((t, i) => (
                <Rise
                  as="li"
                  className="k-pcard"
                  rm={rm}
                  key={i}
                  x={i === 1 ? 0 : i === 0 ? -60 : 60}
                  y={i === 1 ? 70 : 30}
                  r={i === 0 ? -5 : i === 2 ? 5 : 2}
                  d={i * 0.12}
                >
                  <span className="q" aria-hidden="true">
                    0{i + 1}
                  </span>
                  <p>
                    {t[0]}
                    <b>{t[1]}</b>
                  </p>
                </Rise>
              ))}
            </ul>
          </div>
        </section>

        {/* ==================== 4. 仕組み（スクロールで 9 → 3 → 1） ==================== */}
        <section className="k-sec k-how">
          <Heading text={['出す前に、', '確かめる。']} className="k-h2 big" rm={rm} />
          <Rise rm={rm} y={20}>
            <p className="k-body k-how-lead"><Tx s={'いくつも試して、|反応の数字で絞り、\n残った1枚だけを|広告にします。'} /></p>
          </Rise>
          <Funnel post={post} rm={rm} />
          <Rise rm={rm} x={-40} y={0}>
            <p className="k-note"><Tx s={'色、言い方、|写真か文字か。\n投稿ごとに|変えた点を|記録しているので、\nなぜ反応したかを|後から数字で|見比べられます。'} /></p>
          </Rise>
        </section>

        {/* ==================== 5. 約束 ==================== */}
        <section className="k-sec k-promise">
          <Heading text={['反応が出なければ、', '広告に進みません。']} className="k-h2 huge" rm={rm} />
          <Rise rm={rm} y={24} d={0.15}>
            <p className="k-body">
              <Tx s={'反応が出なかった投稿は、|広告にしません。\n広告費も|かかりません。\n反応の基準（どの数字を、|いくつ以上とするか）は、\n始める前に|一緒に決めます。'} />
            </p>
          </Rise>
        </section>

        {/* ==================== 6. 手に入るもの ==================== */}
        <section className="k-sec k-gains">
          <Heading text={['手に入るもの']} className="k-h2" rm={rm} />
          <ul className="k-gcards">
            {[
              ['反応が出た投稿', 'そのまま広告に使えます'],
              ['どの投稿に、なぜ反応があったかのレポート', '変えた点ごとに数字で並べます'],
              ['広告に進む場合の、予算と配信先の案', '出すかどうかは、お客様が決めます'],
            ].map((g, i) => (
              <Rise as="li" className="k-gcard" rm={rm} key={i} y={50} r={i % 2 ? 3 : -3} d={i * 0.1}>
                <span className="k-gnum" aria-hidden="true">
                  {i + 1}
                </span>
                <b>{g[0]}</b>
                <span>{g[1]}</span>
              </Rise>
            ))}
          </ul>
          <Rise rm={rm} y={16}>
            <p className="k-body"><Tx s={'反応が出なかった場合も、\n試した投稿と|数字のレポートは|お渡しします。'} /></p>
          </Rise>
        </section>

        {/* ==================== 7. 価格と無料相談。PCでは価格の右にフォームを置き、スクロールを減らす ==================== */}
        <section className="k-sec k-price-sec">
          <div className="k-pf">
            <div className="k-pf-l">
            <Heading text={['価格']} className="k-h2" rm={rm} />
            <Rise className="k-price" rm={rm} x={40} y={20} r={-1.5}>
              <p className="k-amount">
                {LP.price ?? '価格はご相談時にお伝えします'}
                {LP.price && LP.term && <small>／ {LP.term}</small>}
              </p>
              <p className="k-pnote"><Tx s={'単発のパッケージです。\n月額や継続の契約は|ありません。\n相談は無料で、|相談したからといって|申し込む必要は|ありません。'} /></p>
              <p className="k-pnote"><Tx s={'検証パッケージの料金は、|反応の有無に|かかわらず|かかります。'} /></p>
              <div className="k-inc">
                <div>
                  <h3>含まれるもの</h3>
                  <ul>
                    <li>投稿の制作</li>
                    <li>お客様のアカウントでの配信</li>
                    <li>反応の計測</li>
                    <li>レポート</li>
                  </ul>
                </div>
                <div>
                  <h3>含まれないもの</h3>
                  <ul>
                    <li>
                      <Tx s={'広告費（Metaに|直接お支払い|いただきます。\n当社を経由しません）'} />
                    </li>
                  </ul>
                </div>
              </div>
            </Rise>
            {/* 必須の一文。本文と同じ大きさ・同じ色。動かさない */}
            <p className="k-must"><Tx s={'本サービスは、|投稿の制作・配信・計測・分析を|行うものであり、\n売上や集客などの|効果を保証するものでは|ありません。'} /></p>
            </div>

            {/* 無料相談 */}
            <div className="k-pf-r k-formsec" id="k-form" ref={formRef}>
            <Rise className="k-formcard" rm={rm} y={60} r={-2}>
              <div className="k-formtop">
                <p className="k">検証パッケージ</p>
                <h2>無料で相談する</h2>
                <p><Tx s={'2営業日以内に、|メールで返信します。\n電話はしません。'} /></p>
              </div>
              <form className="k-form" onSubmit={onSubmit} noValidate>
                <div className="fld">
                  <label htmlFor="k-company">
                    会社名・屋号 <span className="rq">必須</span>
                    <span className="k-lblnote">個人事業主の方は屋号</span>
                  </label>
                  <input
                    id="k-company"
                    type="text"
                    required
                    autoComplete="organization"
                    placeholder="株式会社◯◯ ／ ◯◯商店"
                    value={form.company}
                    aria-invalid={fieldErr.company ? true : undefined}
                    aria-describedby={fieldErr.company ? 'k-company-err' : undefined}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                  />
                  {fieldErr.company && (
                    <p className="k-ferr" id="k-company-err">
                      {fieldErr.company}
                    </p>
                  )}
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
                    aria-invalid={fieldErr.name ? true : undefined}
                    aria-describedby={fieldErr.name ? 'k-name-err' : undefined}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {fieldErr.name && (
                    <p className="k-ferr" id="k-name-err">
                      {fieldErr.name}
                    </p>
                  )}
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
                    aria-invalid={fieldErr.email ? true : undefined}
                    aria-describedby={fieldErr.email ? 'k-email-err' : undefined}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {fieldErr.email && (
                    <p className="k-ferr" id="k-email-err">
                      {fieldErr.email}
                    </p>
                  )}
                </div>
                <div className="fld">
                  <label htmlFor="k-content">
                    相談したいこと <span className="op">任意</span>
                  </label>
                  <textarea
                    id="k-content"
                    rows={3}
                    placeholder="例）◯◯（商品名）の広告を出したい。Instagramは @◯◯"
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

                <p className="k-bizonly"><Tx s={'事業者の方向けのサービスです。\n個人の方のご相談は|受け付けていません。'} /></p>
                <button className="k-cta k-sub" type="submit" disabled={sent === 'sending'}>
                  <span className="k-cta-shine" aria-hidden="true" />
                  <span className="t">{sent === 'sending' ? '送信中…' : '無料で相談する'}</span>
                </button>
                {sent === 'error' && (
                  <p className="k-err" role="alert">
                    {msg}
                  </p>
                )}
                <p className="k-fnote">ご相談の内容とご連絡にのみ使用します。</p>
              </form>
            </Rise>
            </div>
          </div>
        </section>
      </main>

      <footer className="k-foot">
        <div className="k-foot-in">
          <nav aria-label="法的情報">
            <Link href="/privacy">プライバシーポリシー</Link>
          </nav>
          <p className="k-co">運営会社：株式会社DP-GUILD</p>
          <p className="k-cp">&copy; {new Date().getFullYear()} DP-GUILD</p>
        </div>
      </footer>

      {/* 追従ボタン。入口の演出のあとに現れ、以降は出しておく。フォームが見えている間だけ引っ込める */}
      <motion.a
        href="#k-form"
        className="k-bar"
        onClick={goForm}
        initial={false}
        animate={barOn ? { y: 0, opacity: 1 } : { y: 90, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        aria-hidden={!barOn}
        tabIndex={barOn ? 0 : -1}
      >
        <span>検証パッケージ</span>
        <b>無料で相談する →</b>
      </motion.a>
    </div>
  );
}
