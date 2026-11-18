import { getCloudflareContext } from '@opennextjs/cloudflare';

// 問い合わせ・資料請求を D1（wrangler.jsonc の d1_databases: DB）に残す。
// メール・Slack と並ぶ3つ目の残し先。失敗しても送信そのものは止めない（呼ぶ側で数える）
type D1Like = {
  prepare(query: string): { bind(...values: unknown[]): { run(): Promise<unknown> } };
};

export type InquiryRow = {
  kind: 'contact' | 'document';
  status: string;
  name: string;
  email: string;
  company?: string | null;
  website?: string | null;
  phone?: string | null;
  service?: string | null;
  content?: string | null;
};

export function hasInquiryDb(): boolean {
  try {
    return Boolean((getCloudflareContext().env as unknown as { DB?: D1Like }).DB);
  } catch {
    return false;
  }
}

export async function saveInquiry(row: InquiryRow): Promise<boolean> {
  try {
    const db = (getCloudflareContext().env as unknown as { DB?: D1Like }).DB;
    if (!db) return false;
    await db
      .prepare(
        'INSERT INTO inquiries (kind, status, name, email, company, website, phone, service, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
      )
      .bind(
        row.kind,
        row.status,
        row.name,
        row.email,
        row.company || null,
        row.website || null,
        row.phone || null,
        row.service || null,
        row.content || null,
        new Date().toISOString()
      )
      .run();
    return true;
  } catch (error) {
    console.error('D1 insert failed:', error);
    return false;
  }
}
