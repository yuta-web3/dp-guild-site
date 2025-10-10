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