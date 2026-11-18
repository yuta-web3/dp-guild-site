import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { contactSchema } from '@/lib/contact-schema';
import { saveInquiry } from '@/lib/save-inquiry';


// Resend setup
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// メール本文に入れる値はお客様の入力なので、HTML として解釈されないようにする
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// メールテンプレート
const createEmailHtml = (raw: { name: string; email: string; company?: string; website?: string; content: string }) => {
  const data = {
    name: escapeHtml(raw.name),
    email: escapeHtml(raw.email),
    company: raw.company ? escapeHtml(raw.company) : '',
    website: raw.website ? escapeHtml(raw.website) : '',
    content: escapeHtml(raw.content),
  };
  return `
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
      ${data.website ? `
        <div class="row">
          <div class="label">サイト</div>
          <div class="value"><a href="${data.website.startsWith('http') ? data.website : 'https://' + data.website}">${data.website}</a></div>
        </div>` : ''}
      ${data.company ? `
      <div class="field">
        <div class="label">会社名</div>
        <div class="value">${data.company}</div>
      </div>
      ` : ''}
      <div class="field">
        <div class="label">ご相談内容</div>
        <div class="value" style="white-space: pre-wrap;">${data.content || '（未記入）'}</div>
      </div>

      <div class="footer">
        <p>1営業日以内に担当者よりご連絡させていただきます。</p>
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
};


// 営業の見分け（2026-11-05 石井さん「つけとこう」）：売り込みの言い方が2つ以上あれば、通知の件名に【営業】と付け、保存先の status を sales にする。
// 弾かずに受け付ける（本物の相談を間違えて捨てないため）。お客様も使う言葉（御社・拝見・営業・弊社では）は入れない
const SALES_WORDS = ['のご提案', 'ご紹介させて', 'のご案内', '弊社サービス', 'お役に立て', '掲載', '代理店募集', 'パートナー', '貴社', 'アポイント', '商談', 'サービス資料', '無料トライアル', '突然のご連絡'];
function looksLikeSales(data: { company?: string; content: string }): boolean {
  const text = `${data.company || ''}\n${data.content}`;
  return SALES_WORDS.filter((w) => text.includes(w)).length >= 2;
}

// Slack通知
async function sendSlackNotification(
  data: { name: string; email: string; company?: string; website?: string; content: string },
  sales = false,
): Promise<boolean> {
  if (!process.env.SLACK_WEBHOOK_URL) return false;

  try {
    const res = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `${sales ? '【営業】' : ''}新しいお問い合わせがありました`,
        blocks: [
          {
            type: 'header',
            text: {
              type: 'plain_text',
              text: `${sales ? '【営業】' : '📩 '}新しいお問い合わせ`
            }
          },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*お名前:*\n${data.name}` },
              { type: 'mrkdwn', text: `*メール:*\n${data.email}` },
              { type: 'mrkdwn', text: `*会社名:*\n${data.company || 'なし'}` },
              { type: 'mrkdwn', text: `*サイト:*\n${data.website || 'なし'}` },
              { type: 'mrkdwn', text: `*送信日時:*\n${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}` },
            ]
          },
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: `*ご相談内容:*\n\`\`\`${data.content || '（未記入）'}\`\`\``
            }
          }
        ]
      })
    });
    if (!res.ok) console.error('Slack notification failed:', res.status);
    return res.ok;
  } catch (error) {
    console.error('Slack notification failed:', error);
    return false;
  }
}

// bot よけ（Cloudflare Turnstile）の印を、Cloudflare に照らす（2026-11-18）。印は1回だけ・5分で切れる
async function verifyTurnstile(secret: string, token: string, ip: string | null): Promise<boolean> {
  try {
    const form = new URLSearchParams({ secret, response: token });
    if (ip) form.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: form });
    const data = (await res.json()) as { success?: boolean };
    return data.success === true;
  } catch (error) {
    console.error('Turnstile verify failed:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // bot よけ：秘密の鍵があれば、印の無い送信・通らない送信は受け付けない（保存も通知もしない）
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
    if (turnstileSecret) {
      const token = typeof body?.turnstileToken === 'string' ? body.turnstileToken : '';
      const passed = token ? await verifyTurnstile(turnstileSecret, token, request.headers.get('cf-connecting-ip')) : false;
      if (!passed) {
        return NextResponse.json({ error: 'Bot check failed' }, { status: 400 });
      }
    }

    // バリデーション
    // 相談内容は任意。空なら空文字にそろえる
    const parsed = contactSchema.parse(body);
    const validatedData = { ...parsed, content: parsed.content || '' };

    // スパム対策: ハニーポットチェック
    if (validatedData.honeypot) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }

    // スパム対策: 時間チェック（3秒以内の送信を拒否）
    const timeDiff = Date.now() - validatedData.timestamp;
    if (timeDiff < 3000) {
      return NextResponse.json({ error: 'Please take your time to fill the form' }, { status: 400 });
    }

    // 保存・社内へのメール・Slack のどれか1つに届けば受け付けとする。
    // どれにも届かなければ、お客様の情報が当社に届いていないので、画面にエラーを出してメールでの連絡を案内する
    let delivered = 0;
    const sales = looksLikeSales(validatedData);

    // D1 に残す（メール・Slack と並ぶ3つ目の残し先）
    if (
      await saveInquiry({
        kind: 'contact',
        status: sales ? 'sales' : 'pending',
        name: validatedData.name,
        email: validatedData.email,
        company: validatedData.company || null,
        website: validatedData.website || null,
        content: validatedData.content,
      })
    ) {
      delivered++;
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
          subject: `${sales ? '【営業】' : ''}【新規問い合わせ】${validatedData.name} 様より`,
          html: `
            <h2>新しいお問い合わせがありました</h2>
            <p><strong>お名前:</strong> ${escapeHtml(validatedData.name)}</p>
            <p><strong>メール:</strong> ${escapeHtml(validatedData.email)}</p>
            <p><strong>会社名:</strong> ${validatedData.company ? escapeHtml(validatedData.company) : 'なし'}</p>
            <p><strong>内容:</strong><br>${escapeHtml(validatedData.content || '（未記入）').replace(/\n/g, '<br>')}</p>
          `,
        });
        console.log('Notification email result:', notificationResult);
        // Resend は失敗しても例外を投げず error を返す
        if (notificationResult.error) {
          console.error('Notification email failed:', notificationResult.error);
        } else {
          delivered++;
        }

        console.log('Emails sent successfully to:', validatedData.email, 'and', toEmail);
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }
    } else {
      console.log('Resend not configured, skipping email sending');
    }

    // Slack通知（環境変数が設定されている場合）
    if (await sendSlackNotification(validatedData, sales)) delivered++;

    if (delivered === 0) {
      console.error('Contact lost: save, email and Slack all failed or not configured');
      return NextResponse.json({
        error: '送信を受け付けられませんでした。お手数ですが info@dp-guild.com までメールでご連絡ください。'
      }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'お問い合わせありがとうございます。1営業日以内にご連絡させていただきます。'
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
      error: 'エラーが発生しました。お手数ですが info@dp-guild.com へメールでお問い合わせください。'
    }, { status: 500 });
  }
}