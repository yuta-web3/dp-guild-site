-- Supabaseで実行するSQL

-- お問い合わせテーブル
CREATE TABLE IF NOT EXISTS inquiries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL,
  company VARCHAR(100),
  content TEXT NOT NULL,
  reference_url TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックス
CREATE INDEX IF NOT EXISTS idx_inquiries_created_at ON inquiries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_email ON inquiries(email);

-- RLS (Row Level Security) を有効化
ALTER TABLE inquiries ENABLE ROW LEVEL SECURITY;

-- 管理者のみアクセス可能なポリシー（必要に応じて調整）
CREATE POLICY "Admin can view all inquiries" ON inquiries
  FOR SELECT USING (auth.uid() IS NOT NULL);

-- Service Roleキーでの挿入を許可
CREATE POLICY "Service role can insert inquiries" ON inquiries
  FOR INSERT WITH CHECK (TRUE);

-- 更新日時の自動更新トリガー
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_inquiries_updated_at BEFORE UPDATE
    ON inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();