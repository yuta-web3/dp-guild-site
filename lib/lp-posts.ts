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
};

export const lpPosts: LpPost[] = [
  {
    id: 'p001',
    src: '/images/lp/posts/p001.png',
    alt: '効くか分からない広告に、お金を払っていませんか。',
  },
];

/** utm_content から対応する投稿を引く。無ければ undefined */
export function getLpPost(id: string | null | undefined): LpPost | undefined {
  if (!id) return undefined;
  return lpPosts.find((p) => p.id === id);
}
