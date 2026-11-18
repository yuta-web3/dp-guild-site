-- 問い合わせ・資料請求を残す表（Cloudflare D1。2026-11-18 Supabase から変えた）
-- 書き込むのは本番の Worker（wrangler.jsonc の d1_databases: DB）だけ。外から読む入口は無い
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  kind TEXT NOT NULL,              -- contact（お問い合わせ）／document（資料請求）
  status TEXT NOT NULL,            -- pending／sales（営業とみた物）／document_request
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  website TEXT,
  phone TEXT,
  service TEXT,                    -- 資料請求のサービス（slug）
  content TEXT,
  created_at TEXT NOT NULL         -- ISO 8601（UTC）
);
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_inquiries_kind ON inquiries(kind);
