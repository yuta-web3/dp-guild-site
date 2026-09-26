// 検証パッケージLP の「証拠」セクションで使う、投稿IDと画像の対応表。
//
// 画像は自社で用意したバナー（public/images/lp/posts/ に投稿IDの名前で置く）。
// Instagram から取りに行かない。
// URL の utm_content がここにある ID と一致したときだけ、LP に画像を出す。
// 増やすときは配列に足すだけ。

export type LpPost = {
  /** 投稿ID。utm_content の値と一致させる（p001〜） */
  id: string;
  /** 画像のパス（public 配下） */
  src: string;
  /** 投稿の見出し文。画像の代替テキスト */
  alt: string;
  /** 画像の実寸。未指定は 1080×1350（Instagram の縦長） */
  width?: number;
  height?: number;
  /** 投稿の状態。添え文がこれで変わる。更新し忘れても嘘にならないよう、省略時は testing
   *  testing  … 試している最中（反応の数字を見て決める）
   *  selected … 試した中で反応が出た（これから広告にする）
   *  ad       … 広告にした */
  status?: LpPostStatus;
};

export type LpPostStatus = 'testing' | 'selected' | 'ad';

// 本物の投稿ができたら足す（画像は public/images/lp/posts/ に投稿IDの名前で置く）
export const lpPosts: LpPost[] = [];

/** utm_content から対応する投稿を引く。無ければ undefined */
export function getLpPost(id: string | null | undefined): LpPost | undefined {
  if (!id) return undefined;
  return lpPosts.find((p) => p.id === id);
}
