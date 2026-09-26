import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(1, '氏名は必須です')
    .max(100, '氏名は100文字以内で入力してください'),

  email: z.string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),

  company: z.string()
    .max(100, '会社名は100文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // サイトのURL。会社名より直接的で、そのまま開いて中身を見られる
  website: z.string()
    .max(300, 'URLは300文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  content: z.string()
    .min(1, '要件・相談内容は必須です')
    .min(10, '要件・相談内容は10文字以上で入力してください')
    .max(2000, '要件・相談内容は2000文字以内で入力してください'),

  // ハニーポット（スパム対策）
  honeypot: z.string().max(0),

  // 送信時刻（スパム対策）
  timestamp: z.number(),
});

export type ContactFormData = z.infer<typeof contactSchema>;


// ---- 検証パッケージLP（/lp/kensho）用 ----
// 項目は4つだけ（会社名・屋号／お名前／メール／相談したいこと）。
// 相談したいことは任意。UTM と着地URLは隠し項目で受け取り、通知メールに1行で入れる。
// 既存の contactSchema は変えない（既存フォームの動作を壊さないため）。

const utmField = z.string()
  .max(100, 'パラメータは100文字以内です')
  .optional()
  .or(z.literal(''));

export const lpContactSchema = z.object({
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
    .max(2000, '相談したいことは2000文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // ハニーポット（スパム対策）
  honeypot: z.string().max(0),

  // 送信時刻（スパム対策）
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

export type LpContactFormData = z.infer<typeof lpContactSchema>;
