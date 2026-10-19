'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import type { BlogSummary } from '@/lib/microcms';

// ブログ一覧：カテゴリで絞る・言葉で探す・ページ送り。
// 記事は111件ほどなので、全件を最初に受け取り、画面の中で絞り込む（押した瞬間に変わる。サーバーへの問い合わせなし）。
// 絞り込みの状態はURL（?category=…&q=…&page=…）に残し、共有・戻るで同じ画面に戻れるようにする。
const PER = 12;

const norm = (s: string) => s.normalize('NFKC').toLowerCase();
const fmt = (d: string) =>
  new Date(d).toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '.');

export default function BlogIndex({ posts }: { posts: BlogSummary[] }) {
  const [cat, setCat] = useState('all');
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const ready = useRef(false);

  // カテゴリは記事の多い順
  const cats = useMemo(() => {
    const m = new Map<string, { id: string; name: string; n: number }>();
    posts.forEach((p) => {
      if (!p.category) return;
      const c = m.get(p.category.id) ?? { id: p.category.id, name: p.category.name, n: 0 };
      c.n += 1;
      m.set(p.category.id, c);
    });
    return [...m.values()].sort((a, b) => b.n - a.n);
  }, [posts]);

  // URLから状態を戻す
  useEffect(() => {
    const sp = new URLSearchParams(window.location.search);
    const c = sp.get('category');
    if (c && cats.some((x) => x.id === c)) setCat(c);
    setQ(sp.get('q') ?? '');
    setPage(Math.max(1, Number(sp.get('page')) || 1));
    ready.current = true;
  }, [cats]);

  // 状態をURLへ
  useEffect(() => {
    if (!ready.current) return;
    const sp = new URLSearchParams();
    if (cat !== 'all') sp.set('category', cat);
    if (q.trim()) sp.set('q', q.trim());
    if (page > 1) sp.set('page', String(page));
    const qs = sp.toString();
    window.history.replaceState(null, '', qs ? `/blog?${qs}` : '/blog');
  }, [cat, q, page]);

  // 「/」で検索欄へ
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(t.tagName)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const hits = useMemo(() => {
    const words = norm(q).split(/\s+/).filter(Boolean);
    return posts.filter((p) => {
      if (cat !== 'all' && p.category?.id !== cat) return false;
      if (!words.length) return true;
      const hay = norm(`${p.title} ${p.description ?? ''} ${p.category?.name ?? ''}`);
      return words.every((w) => hay.includes(w));
    });
  }, [posts, cat, q]);

  const filtered = cat !== 'all' || q.trim() !== '';
  // 絞り込んでいない1ページ目だけ、一番新しい記事を大きく出す。その分1件多く載せて、3列の並びを欠けさせない
  const extra = filtered ? 0 : 1;
  const pages = Math.max(1, Math.ceil((hits.length - extra) / PER));
  const cur = Math.min(page, pages);
  const from = cur === 1 ? 0 : (cur - 1) * PER + extra;
  const shown = hits.slice(from, cur === 1 ? PER + extra : from + PER);
  const feature = extra && cur === 1 ? shown[0] : null;
  const rest = feature ? shown.slice(1) : shown;
  // カテゴリごとに絵の色を変える（記事の多い順に0〜3）
  const tone = (id?: string) => Math.max(0, cats.findIndex((c) => c.id === id)) % 4;

  const go = (n: number) => {
    setPage(n);
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  const pickCat = (id: string) => {
    setCat(id);
    setPage(1);
  };
  const catName = cats.find((c) => c.id === cat)?.name;

  return (
    <>
      <div className="bx-tools">
        <label className="bx-search">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-4.2-4.2" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            placeholder="記事を探す（例：SNS 費用）"
            aria-label="記事を言葉で探す"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setPage(1);
            }}
          />
          {q ? (
            <button type="button" className="bx-clear" onClick={() => setQ('')} aria-label="言葉を消す">
              ×
            </button>
          ) : (
            <kbd aria-hidden="true">/</kbd>
          )}
        </label>

        <div className="bx-cats" role="group" aria-label="カテゴリで絞る">
          <button type="button" className="bx-cat" aria-pressed={cat === 'all'} onClick={() => pickCat('all')}>
            すべて<span>{posts.length}</span>
          </button>
          {cats.map((c) => (
            <button key={c.id} type="button" className="bx-cat" aria-pressed={cat === c.id} onClick={() => pickCat(c.id)}>
              {c.name}
              <span>{c.n}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="bx-count" ref={listRef} aria-live="polite">
        {filtered ? (
          <>
            {catName && <b>{catName}</b>}
            {q.trim() && <b>「{q.trim()}」</b>}
            の記事 <em>{hits.length}</em>件
            <button
              type="button"
              className="bx-reset"
              onClick={() => {
                setCat('all');
                setQ('');
                setPage(1);
              }}
            >
              絞り込みを外す
            </button>
          </>
        ) : (
          <>
            全<em>{posts.length}</em>件の記事
          </>
        )}
      </div>

      {hits.length === 0 ? (
        <div className="bx-empty">
          <p>当てはまる記事が見つかりませんでした。</p>
          <p>言葉を短くするか、カテゴリを「すべて」にして探してください。</p>
        </div>
      ) : (
        <>
          {feature && <Card p={feature} big tone={tone(feature.category?.id)} />}
          <div className="bx-grid">
            {rest.map((p, i) => (
              <Card key={p.id} p={p} i={i} tone={tone(p.category?.id)} />
            ))}
          </div>
        </>
      )}

      {pages > 1 && (
        <nav className="bx-pager" aria-label="ページ送り">
          <button type="button" disabled={cur === 1} onClick={() => go(cur - 1)}>
            ← 前へ
          </button>
          <ol>
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <li key={n}>
                <button type="button" aria-current={n === cur ? 'page' : undefined} onClick={() => go(n)}>
                  {n}
                </button>
              </li>
            ))}
          </ol>
          <button type="button" disabled={cur === pages} onClick={() => go(cur + 1)}>
            次へ →
          </button>
        </nav>
      )}
    </>
  );
}

function Card({ p, big = false, i = 0, tone = 0 }: { p: BlogSummary; big?: boolean; i?: number; tone?: number }) {
  return (
    <Link href={`/blog/${p.id}`} className={`bx-card${big ? ' big' : ''}`} style={{ ['--i' as string]: i }}>
      <span className="bx-thumb" aria-hidden="true">
        {p.eyecatch ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={`${p.eyecatch.url}?w=${big ? 960 : 640}&fm=webp`} alt="" loading={big ? 'eager' : 'lazy'} />
        ) : (
          <span className={`bx-art t${tone}`}>
            <i />
            <b>{p.category?.name ?? 'ブログ'}</b>
          </span>
        )}
      </span>
      <span className="bx-body">
        <span className="bx-meta">
          {p.category && <span className="bx-tag">{p.category.name}</span>}
          <time dateTime={p.publishedAt}>{fmt(p.publishedAt)}</time>
        </span>
        <span className="bx-title">{p.title}</span>
        {p.description && <span className="bx-desc">{p.description}</span>}
        <span className="bx-more">
          読む<i />
        </span>
      </span>
    </Link>
  );
}
