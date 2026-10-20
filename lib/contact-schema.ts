import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string()
    .min(1, '氏名は必須です')
    .max(100, '氏名は100文字以内で入力してください'),

  email: z.string()
    .min(1, 'メールアドレスは必須です')
    .email('有効なメールアドレスを入力してください'),

  // 必須（個人事業の方は屋号かお名前）。お問い合わせ・入口ページの両方で必須にしている
  company: z.string()
    .min(1, '会社名・屋号は必須です')
    .max(100, '会社名は100文字以内で入力してください'),

  // サイトのURL。会社名より直接的で、そのまま開いて中身を見られる
  website: z.string()
    .max(300, 'URLは300文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // 任意（お問い合わせは連絡先が分かればよい。相談内容は空でも受け付ける）
  content: z.string()
    .max(2000, '要件・相談内容は2000文字以内で入力してください')
    .optional()
    .or(z.literal('')),

  // ハニーポット（スパム対策）
  honeypot: z.string().max(0),

  // 送信時刻（スパム対策）
  timestamp: z.number(),
});

export type ContactFormData = z.infer<typeof contactSchema>;

