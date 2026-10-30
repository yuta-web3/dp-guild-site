import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { ZodError } from 'zod';
import { kenshoRequestSchema, type KenshoRequest } from '@/app/lp/kensho/_parts/schema';

// 検証パッケージLP（/lp/kensho）専用の資料請求の送り先。
// サイトのお問い合わせ（/api/contact）・資料請求（/api/document）とは分ける（2026-10-19 LPを独立させる）。
// 送信した人には、資料PDFのリンクを自動のメールで送る。社内にはメールとSlackで、経路と投稿番号を付けて知らせる。


const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://dp-guild.com';
// PDFはページから直接リンクしない。名前は推測されないよう乱数つき（変えるとメールのリンクが切れるので変えない）
const DOC_URL = `${SITE}/docs/dp-guild-kensho-5b0fd28d69a8.pdf`;
const COMPANY_MAIL = 'info@dp-guild.com';

const escape = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// 「経路: dm ／ 投稿: p001 ／ 着地: /lp/kensho?...」の1行
const routeLine = (d: KenshoRequest) =>
  `経路: ${d.utm_source || '-'} ／ 投稿: ${d.utm_content || '-'} ／ 着地: ${d.landing || '-'}`;

const autoReplyHtml = (name: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>検証パッケージの資料をお送りします</title></head>
<body style="font-family:'Hiragino Sans','Meiryo',sans-serif;line-height:1.8;color:#333;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);color:#fff;padding:28px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;font-size:22px;">検証パッケージの資料をお送りします</h1>
    </div>
    <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;">
      <p>${escape(name)} 様</p>
      <p>資料のご請求、ありがとうございます。下記より資料をダウンロードいただけます。</p>
      <p style="margin:24px 0;">
        <a href="${DOC_URL}" style="display:inline-block;background:#101522;color:#fff;text-decoration:none;padding:14px 28px;font-weight:bold;">資料をダウンロード</a>
      </p>
      <p>ご相談は、このメールにそのままご返信ください。1営業日以内にご返信します。</p>
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;font-size:14px;color:#6b7280;">
        株式会社DP-GUILD<br>
        〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9<br>
        Email: ${COMPANY_MAIL}
      </div>
    </div>
  </div>
</body>
</html>
`;

async function notifySlack(d: KenshoRequest) {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: '検証パッケージの資料請求がありました',
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: '📩 検証パッケージの資料請求' } },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*会社名:*\n${d.company}` },
              { type: 'mrkdwn', text: `*お名前:*\n${d.name}` },
              { type: 'mrkdwn', text: `*メール:*\n${d.email}` },
              { type: 'mrkdwn', text: `*送信日時:*\n${new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })}` },
              { type: 'mrkdwn', text: `*LP:*\n${routeLine(d)}` },
            ],
          },
          { type: 'section', text: { type: 'mrkdwn', text: `*ご質問・ご相談:*\n\`\`\`${d.content || '（未記入）'}\`\`\`` } },
        ],
      }),
    });
  } catch (e) {
    console.error('Slack notification failed:', e);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // スパム対策：見えない欄に入力があれば、送信できたように見せて何もしない
    if (body && typeof body.honeypot === 'string' && body.honeypot.length > 0) {
      return NextResponse.json({ success: true });
    }

    const data = kenshoRequestSchema.parse(body);

    if (Date.now() - data.timestamp < 1500) {
      return NextResponse.json(
        { error: '送信が早すぎたため受け付けられませんでした。数秒おいて、もう一度お試しください。' },
        { status: 400 }
      );
    }

    // メールが送れなかったら、受け付けていないことを画面に正直に返す（申込を黙って消さない）
    let delivered = false;
    if (resend) {
      try {
        const fromEmail = process.env.COMPANY_EMAIL || 'contact@dp-guild.com';
        const companyName = process.env.COMPANY_NAME || '株式会社DP-GUILD';
        const toEmail = process.env.COMPANY_EMAIL || 'contact@dp-guild.com';

        const reply = await resend.emails.send({
          from: `${companyName} <${fromEmail}>`,
          to: data.email,
          replyTo: toEmail,
          subject: '【検証パッケージ】資料をお送りします',
          html: autoReplyHtml(data.name),
        });
        if (reply.error) throw new Error(`Resend: ${reply.error.message}`);

        const notify = await resend.emails.send({
          from: `Kensho LP <${fromEmail}>`,
          to: toEmail,
          replyTo: data.email,
          subject: `【検証パッケージ 資料請求】${data.company} ${data.name} 様`,
          html: `
            <h2>検証パッケージの資料請求がありました</h2>
            <p><strong>会社名:</strong> ${escape(data.company)}</p>
            <p><strong>お名前:</strong> ${escape(data.name)}</p>
            <p><strong>メール:</strong> ${escape(data.email)}</p>
            <p><strong>LP:</strong> ${escape(routeLine(data))}</p>
            <p><strong>ご質問・ご相談:</strong></p>
            <p style="white-space:pre-wrap;">${escape(data.content || '（未記入）')}</p>
          `,
        });
        if (notify.error) throw new Error(`Resend: ${notify.error.message}`);
        delivered = true;
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }
    }

    await notifySlack(data);

    if (!delivered) {
      console.error('Kensho request lost: email not configured or failed');
      return NextResponse.json(
        { error: `送信を受け付けられませんでした。お手数ですが ${COMPANY_MAIL} までメールでご連絡ください。` },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      const issue = error.issues[0];
      const jp = issue && /[ぁ-んァ-ン一-龥]/.test(issue.message);
      return NextResponse.json(
        { error: jp ? issue.message : '入力内容を確かめて、もう一度お試しください。', field: issue ? String(issue.path[0] ?? '') : '' },
        { status: 400 }
      );
    }
    console.error('Kensho request failed:', error);
    return NextResponse.json(
      { error: `送信できませんでした。もう一度お試しいただくか、${COMPANY_MAIL} までメールでご連絡ください。` },
      { status: 400 }
    );
  }
}
