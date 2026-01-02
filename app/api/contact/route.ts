import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/contact-schema';

export const runtime = 'edge';

// Resend setup
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// メールテンプレート
const createEmailHtml = (data: { name: string; email: string; company?: string; content: string }) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>お問い合わせありがとうございます</title>
  <style>
    body { font-family: 'Hiragino Sans', 'Meiryo', sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0F172A 0%, #1E293B 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
    .content { background: #fff; padding: 30px; border: 1px solid #e5e7eb; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 20px; }
    .label { font-weight: bold; color: #6b7280; font-size: 14px; margin-bottom: 5px; }
    .value { color: #111827; font-size: 16px; }
    .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 24px;">お問い合わせありがとうございます</h1>
      <p style="margin: 10px 0 0 0; opacity: 0.9;">以下の内容で承りました</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">お名前</div>
        <div class="value">${data.name}</div>
      </div>
      <div class="field">
        <div class="label">メールアドレス</div>
        <div class="value">${data.email}</div>
      </div>
      ${data.company ? `
      <div class="field">
        <div class="label">会社名</div>
        <div class="value">${data.company}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">ご相談内容</div>
        <div class="value" style="white-space: pre-wrap;">${data.content}</div>
      </div>

      <div class="footer">
        <p>2営業日以内に担当者よりご連絡させていただきます。</p>
        <p style="margin-top: 20px;">
          株式会社DP-GUILD<br>
          〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9<br>
          Email: info@dp-guild.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>
`;


// Slack通知
async function sendSlackNotification(data: { name: string; email: string; company?: string; content: string }) {
  if (!process.env.SLACK_WEBHOOK_URL) return;

  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '新しいお問い合わせがありました',
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: '📩 新しいお問い合わせ'
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*お名前:*\n${data.name}` },
              { type: 'mrkdwn', text: `*メール:*\n${data.email}` },
              { type: 'mrkdwn', text: `*会社名:*\n${data.company || 'なし'}` },
              { type: 'mrkdwn', text: `*送信日時:*\n${new Date().toLocaleString('ja-JP')}` }
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*ご相談内容:*\n\`\`\`${data.content}\`\`\``
            }
          }
        ]
      })
    });
  } catch (error) {
    console.error('Slack notification failed:', error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validatedData = contactSchema.parse(body);

    // スパム対策: ハニーポットチェック
    if (validatedData.honeypot) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // スパム対策: 時間チェック（3秒以内の送信を拒否）
    const timeDiff = Date.now() - validatedData.timestamp;
    if (timeDiff < 3000) {
      return NextResponse.json({ error: 'Please take your time to fill the form' }, { status: 400 });
    }

    // Supabaseに保存（環境変数が設定されている場合）
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          {
            auth: {
              autoRefreshToken: false,
              persistSession: false
            }
          }
        );

        const { error } = await supabaseAdmin
          .from('inquiries')
          .insert({
            name: validatedData.name,
            email: validatedData.email,
            company: validatedData.company || null,
            content: validatedData.content,
            created_at: new Date().toISOString(),
            status: 'pending'
          });

        if (error) {
          console.error('Supabase insert error:', error);
        }
      } catch (dbError) {
        console.error('Database save failed:', dbError);
      }
    }

    // メール送信（Resendが設定されている場合）
    if (resend) {
      try {
        const fromEmail = process.env.COMPANY_EMAIL || 'contact@dp-guild.com';
        const companyName = process.env.COMPANY_NAME || '株式会社DP-GUILD';
        const toEmail = process.env.COMPANY_EMAIL || 'contact@dp-guild.com';

        // お客様への自動返信
        console.log('Sending auto-reply email to:', validatedData.email);
        const autoReplyResult = await resend.emails.send({
          from: `${companyName} <${fromEmail}>`,
          to: validatedData.email,
          replyTo: toEmail,
          subject: 'お問い合わせありがとうございます',
          html: createEmailHtml(validatedData),
        });
        console.log('Auto-reply email result:', autoReplyResult);

        // 社内通知メール
        console.log('Sending notification email to:', toEmail);
        const notificationResult = await resend.emails.send({
          from: `Contact Form <${fromEmail}>`,
          to: toEmail,
          replyTo: validatedData.email,
          subject: `【新規問い合わせ】${validatedData.name} 様より`,
          html: `
            <h2>新しいお問い合わせがありました</h2>
            <p><strong>お名前:</strong> ${validatedData.name}</p>
            <p><strong>メール:</strong> ${validatedData.email}</p>
            <p><strong>会社名:</strong> ${validatedData.company || 'なし'}</p>
            <p><strong>内容:</strong><br>${validatedData.content.replace(/\n/g, '<br>')}</p>
          `,
        });
        console.log('Notification email result:', notificationResult);

        console.log('Emails sent successfully to:', validatedData.email, 'and', toEmail);
      } catch (emailError) {
        console.error('Email send failed:', emailError);
        // メール送信失敗してもフォーム送信自体は成功とする
      }
    } else {
      console.log('Resend not configured, skipping email sending');
    }

    // Slack通知（環境変数が設定されている場合）
    await sendSlackNotification(validatedData);

    return NextResponse.json({
      success: true,
      message: 'お問い合わせありがとうございます。2営業日以内にご連絡させていただきます。'
    });

  } catch (error) {
    console.error('Contact form error:', error);

    if (error instanceof Error && error.name === 'ZodError') {
      return NextResponse.json({
        error: 'フォームの入力内容に誤りがあります',
        details: error
      }, { status: 400 });
    }

    return NextResponse.json({
      error: 'エラーが発生しました。お手数ですがお電話でお問い合わせください。'
    }, { status: 500 });
  }
}