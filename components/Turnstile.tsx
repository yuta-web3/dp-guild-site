'use client';

// 問い合わせフォームの bot よけ（Cloudflare Turnstile）。2026-11-18
// 多くの人には何も出さず裏で確かめ、通ったら印（token）を onToken に渡す。印は1回だけ・5分で切れる
import { useEffect, useRef } from 'react';

// 公開してよい方の鍵（サイトキー）。秘密の鍵は Worker の秘密の値 TURNSTILE_SECRET_KEY にある
const SITE_KEY = '0x4AAAAAAGG_aWuFRyxmrFow';

type TurnstileApi = {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string;
  reset: (id?: string) => void;
  remove: (id: string) => void;
};
declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

// 送信が断られた時に、新しい印を取り直す
export function resetTurnstile() {
  window.turnstile?.reset();
}

export default function Turnstile({ onToken }: { onToken: (token: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let id: string | undefined;
    let stopped = false;
    const draw = () => {
      if (stopped || !ref.current || !window.turnstile || id) return;
      id = window.turnstile.render(ref.current, {
        sitekey: SITE_KEY,
        language: 'ja',
        callback: (token: string) => onToken(token),
        'expired-callback': () => onToken(''),
        'error-callback': () => onToken(''),
      });
    };
    if (window.turnstile) {
      draw();
    } else {
      let s = document.querySelector<HTMLScriptElement>('script[data-turnstile]');
      if (!s) {
        s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.dataset.turnstile = '1';
        document.head.appendChild(s);
      }
      s.addEventListener('load', draw);
    }
    return () => {
      stopped = true;
      if (id && window.turnstile) window.turnstile.remove(id);
    };
  }, [onToken]);

  return <div ref={ref} className="min-h-[65px]" />;
}
