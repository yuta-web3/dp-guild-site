// サービスページのデータの形（2026-10-01 決定）。
// 器は components/service/ServicePage.tsx の1枚。ページごとに lib/services/<slug>.ts を1ファイル足す。
// 文字だけがページごとに違う。見た目は全ページ共通。

export type TD = { t: string; d: string };
export type ServiceFaq = { q: string; a: string };

/** 金額を出すページ（Instagram初期構築・SNS運用代行） */
export type FixedPlan = {
  /** 例: 'フィードプラン' */
  name: string;
  /** 例: 200000 */
  amount: number;
  /** 例: '円（税別）' / '円／月（税別）' */
  unit: string;
  /** そのプランに含まれるもの（短く） */
  items: string[];
  /** 向いている人・期間など1行。不要なら null */
  note: string | null;
  /** モニター価格の金額（任意）。入れると料金カードが「定価 → モニター」の2段になる */
  monitorAmount?: number;
};

export type ServicePrice =
  | {
      kind: 'fixed';
      plans: FixedPlan[];
      /** モニター価格などの一文。無ければ null */
      monitor: string | null;
      /** 税・実費・支払い時期などの補足 */
      notes: string[];
    }
  | {
      kind: 'quote';
      /** 金額を出さない代わりに「何で金額が決まるか」 */
      factors: TD[];
      notes: string[];
    };

export type ServiceVoice = { who: string; quote: string; meta: string };

export type Service = {
  slug: string;
  /** ヘッダー・料金欄に出す短い名前 */
  label: string;
  /** このページが答える主の検索語（1ページ＝1つの検索） */
  searchQuery: string;
  metaTitle: string;
  metaDescription: string;
  /** 見出し。2行 */
  title: [string, string];
  /** title[1] の中にそのまま含まれる語 */
  titleHighlight: string;
  /** 最初の画面の説明。2行に収まる長さ（最初の画面は短く、濃く） */
  summary: string;
  /** 本文の最初に置く説明（検索で読まれる言葉を含む。最初の画面には出さない） */
  lede: string[];
  /** 用語の補足。不要なら null */
  termline: string | null;
  /** ファーストビューの数字の欄（料金の要約・納品・期間など）。2〜3個。
   *  unit は12字以内が目安（長いと狭い画面で行が増える） */
  facts: { k: string; v: string; unit: string }[];
  /** ファーストビューの要点3つ */
  points: string[];
  /** 01 こんな状態ではありませんか */
  problems: string[];
  /** 考え方（任意）。無ければ null */
  concept: TD | null;
  /** 02 何が変わるか */
  gains: TD[];
  /** 04 お渡しするもの */
  deliverables: TD[];
  /** 05 含まないもの */
  excludes: string[];
  /** 06 進め方。プランで違うときは複数。label は null 可 */
  steps: { label: string | null; items: TD[] }[];
  /** 07 料金 */
  price: ServicePrice;
  /** 03 実績（実績マスターの文言どおり。帰属を明示）。表示は「何が変わるか」の直後。
   *  見出し（t）か本文（d）の「150万回」「6万回以上」「1,000本以上」などの数字は、器が自動で目立たせる */
  proof: TD[];
  proofNote: string | null;
  /** 08 よくある質問 */
  faq: ServiceFaq[];
  /** 裏付けのある声だけ。無ければ null */
  voice: ServiceVoice | null;
  /** 資料請求パネルの中身（何が届くか）。title は20字・items は4〜5個・各30字以内が目安。
   *  長いと低い画面で送信ボタンが下に押し出される（器は詰めて表示するが、限界がある） */
  docPitch: { title: string; items: string[] };
  /** 資料のファイル名（public/docs 配下）。未作成なら null */
  doc: string | null;
};
