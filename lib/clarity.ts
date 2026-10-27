// Microsoft Clarity の録画に印を付ける（2026-10-27 代表）
// 目的：来た人がなぜ資料請求しないか・どこでやめるかを知り、ページを直すため。
// 「書き始めた（form_start）」と「送れた（lead）」の印で、録画を
//   ・送った人 ／ 書き始めてやめた人 ／ 書き始めなかった人
// に分けて見る。Clarity が読み込まれていなければ何もしない。

type Clarity = (...args: unknown[]) => void;

const clarityOf = (): Clarity | null => {
  if (typeof window === 'undefined') return null;
  const c = (window as unknown as { clarity?: Clarity }).clarity;
  return typeof c === 'function' ? c : null;
};

const started = new Set<string>();

// フォームに初めて触れた時（1ページで1回だけ）。form はどのフォームか（例：'service:website'・'contact'）
export function markFormStart(form: string) {
  if (started.has(form)) return;
  started.add(form);
  const c = clarityOf();
  if (!c) return;
  c('set', 'form', form);
  c('event', 'form_start');
}

// 送信が受け付けられた時。upgrade で、この人の録画を優先して残す
export function markLead(form: string) {
  const c = clarityOf();
  if (!c) return;
  c('set', 'form', form);
  c('set', 'lead', form);
  c('event', 'lead');
  c('upgrade', 'lead');
}
