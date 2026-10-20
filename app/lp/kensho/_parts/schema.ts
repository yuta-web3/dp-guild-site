import { z } from 'zod';

// 検証パッケージLP（/lp/kensho）の資料請求フォーム。
// サイトのお問い合わせ・資料請求とは分けて、LPの中だけで持つ（2026-10-19 サイトを直してもLPに影響しない形にする）。

const utmField = z.string()
  .max(100, 'パラメータは100文字以内です')
  .optional()
  .or(z.literal(''));

export const kenshoRequestSchema = z.object({
  company: z.string()
    .min(1, '会社名・屋号は必須です')
    .max(100, '会社名・屋号は100文字以内で入力してください'),

  name: z.string()
    .min(1, 'お名前は必須です')
    .max(100, 'お名前は100文字以内で入力してください'),

  email: z.string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),

  content: z.string()
    .max(2000, 'ご質問・ご相談は2000文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // スパム対策
  honeypot: z.string().max(0),
  timestamp: z.number(),

  // 計測。どの経路・どの投稿から来たか
  utm_source: utmField,
  utm_medium: utmField,
  utm_campaign: utmField,
  utm_content: utmField,

  // 開いたURLのパス（クエリ込み）
  landing: z.string()
    .max(300, 'landing は300文字以内です')
    .optional()
    .or(z.literal('')),
});

export type KenshoRequest = z.infer<typeof kenshoRequestSchema>;
