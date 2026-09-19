import { z } from 'zod';

// サービスLPの資料請求フォーム。
// お問い合わせ（contact-schema）とは目的も項目も違うので分けている。
export const documentSchema = z.object({
  company: z.string()
    .min(1, '会社名は必須です')
    .max(100, '会社名は100文字以内で入力してください'),

  name: z.string()
    .min(1, 'お名前は必須です')
    .max(100, 'お名前は100文字以内で入力してください'),

  email: z.string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),

  phone: z.string()
    .max(30, '電話番号は30文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // どのサービスの資料か（lib/services.ts の slug）
  // サイトのURL。会社名より直接的で、そのまま開いて中身を見られる
  website: z.string()
    .max(300, 'URLは300文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  service: z.string().min(1).max(60),

  // スパム対策
  honeypot: z.string().max(0),
  timestamp: z.number(),
});

export type DocumentFormData = z.infer<typeof documentSchema>;
