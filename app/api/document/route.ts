import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { documentSchema } from '@/lib/document-schema';
import { services } from '@/lib/services';

export const runtime = 'edge';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const escape = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const autoReplyHtml = (name: string, serviceLabel: string, docUrl: string | null) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><title>資料請求ありがとうございます</title></head>
<body style="font-family:'Hiragino Sans','Meiryo',sans-serif;line-height:1.8;color:#333;">
  <div style="max-width:600px;margin:0 auto;padding:20px;">
    <div style="background:linear-gradient(135deg,#0F172A 0%,#1E293B 100%);color:#fff;padding:28px;border-radius:8px 8px 0 0;">
      <h1 style="margin:0;font-size:22px;">資料請求ありがとうございます</h1>
      <p style="margin:10px 0 0;opacity:.9;">${escape(serviceLabel)}</p>
    </div>
    <div style="background:#fff;padding:28px;border:1px solid #e5e7eb;border-top:0;border-radius:0 0 8px 8px;">
      <p>${escape(name)} 様</p>
      ${
        docUrl
          ? `<p>下記より資料をダウンロードいただけます。</p>
             <p style="margin:24px 0;">
               <a href="${docUrl}" style="display:inline-block;background:#101522;color:#fff;text-decoration:none;padding:14px 28px;font-weight:bold;">資料をダウンロード</a>
             </p>`
          : `<p>ご請求いただいた資料は、担当より2営業日以内にお送りいたします。</p>`
      }
      <p>ご不明な点がありましたら、本メールにそのままご返信ください。</p>
      <div style="margin-top:28px;padding-top:18px;border-top:1px solid #e5e7eb;font-size:14px;color:#6b7280;">
        株式会社DP-GUILD<br>
        〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9<br>
        Email: info@dp-guild.com
      </div>
    </div>
  </div>
</body>
</html>
`;

async function notifySlack(d: {
  company: string; name: string; email: string; phone?: string; website?: string; serviceLabel: string;
}) {
  if (!process.env.SLACK_WEBHOOK_URL) return;
  try {
    await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: `資料請求がありました（${d.serviceLabel}）`,
        blocks: [
          { type: 'section', text: { type: 'mrkdwn', text: `*資料請求*\n${d.serviceLabel}` } },
          {
            type: 'section',
            fields: [
              { type: 'mrkdwn', text: `*会社名:*\n${d.company}` },
              { type: 'mrkdwn', text: `*サイト:*\n${d.website || 'なし'}` },
              { type: 'mrkdwn', text: `*お名前:*\n${d.name}` },
              { type: 'mrkdwn', text: `*メール:*\n${d.email}` },
              { type: 'mrkdwn', text: `*電話:*\n${d.phone || 'なし'}` },
            ],
          },
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
    const data = documentSchema.parse(body);

    // スパム対策
    if (data.honeypot) {
      return NextResponse.json({ error: 'Invalid submission' }, { status: 400 });
    }
    if (Date.now() - data.timestamp < 3000) {
      return NextResponse.json({ error: 'Please take your time to fill the form' }, { status: 400 });
    }

    // サービス指定が無ければ会社案内。トップページからの請求がこれにあたる
    const COMPANY_DOC = {
      slug: 'company',
      label: '会社案内',
      doc: null as string | null,
    };
    const service = data.service ? services[data.service] : COMPANY_DOC;
    if (!service) {
      return NextResponse.json({ error: 'Unknown service' }, { status: 400 });
    }

    const docUrl = service.doc
      ? `${process.env.NEXT_PUBLIC_SITE_URL || 'https://dp-guild.com'}/docs/${service.doc}`
      : null;

    // 保存（お問い合わせと同じ inquiries テーブルに、資料請求として記録する）
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL,
          process.env.SUPABASE_SERVICE_ROLE_KEY,
          { auth: { autoRefreshToken: false, persistSession: false } }
        );

        const { error } = await supabaseAdmin.from('inquiries').insert({
          name: data.name,
          email: data.email,
          company: data.company,
          content: [
            `【資料請求】${service.label}`,
            `サービス: ${service.slug}`,
            `電話番号: ${data.phone || 'なし'}`,
            `サイト: ${data.website || 'なし'}`,
          ].join('\n'),
          created_at: new Date().toISOString(),
          status: 'document_request',
        });

        if (error) console.error('Supabase insert error:', error);
      } catch (dbError) {
        console.error('Database save failed:', dbError);
      }
    }

    // メール送信
    if (resend) {
      try {
        const fromEmail = process.env.COMPANY_EMAIL || 'contact@dp-guild.com';
        const companyName = process.env.COMPANY_NAME || '株式会社DP-GUILD';
        const toEmail = process.env.COMPANY_EMAIL || 'contact@dp-guild.com';

        await resend.emails.send({
          from: `${companyName} <${fromEmail}>`,
          to: data.email,
          replyTo: toEmail,
          subject: `【資料請求】${service.label}`,
          html: autoReplyHtml(data.name, service.label, docUrl),
        });

        await resend.emails.send({
          from: `Document Request <${fromEmail}>`,
          to: toEmail,
          replyTo: data.email,
          subject: `【資料請求】${data.company} ${data.name} 様（${service.label}）`,
          html: `
            <h2>資料請求がありました</h2>
            <p><strong>サービス:</strong> ${escape(service.label)}</p>
            <p><strong>会社名:</strong> ${escape(data.company)}</p>
            <p><strong>サイト:</strong> ${escape(data.website || 'なし')}</p>
            <p><strong>お名前:</strong> ${escape(data.name)}</p>
            <p><strong>メール:</strong> ${escape(data.email)}</p>
            <p><strong>電話番号:</strong> ${escape(data.phone || 'なし')}</p>
            ${docUrl ? '' : '<p style="color:#b45309;"><strong>※資料PDFが未登録のため、担当者から手動で送付してください。</strong></p>'}
          `,
        });
      } catch (emailError) {
        console.error('Email send failed:', emailError);
      }
    }

    await notifySlack({ ...data, serviceLabel: service.label });

    return NextResponse.json({ success: true, docUrl });
  } catch (error) {
    console.error('Document request failed:', error);
    return NextResponse.json({ error: '送信に失敗しました。時間をおいてお試しください。' }, { status: 400 });
  }
}
