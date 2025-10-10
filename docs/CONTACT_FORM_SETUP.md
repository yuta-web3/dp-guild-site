# お問い合わせフォーム設定ガイド

お問い合わせフォームの機能を有効にするために、以下の外部サービスを設定してください。

## 必須設定

### 1. メール送信設定（いずれか一つを選択）

#### オプション A: お名前.com SMTP（推奨・既存顧客）
お名前.comのレンタルサーバーを契約済みの場合：

1. お名前.comの管理画面でメールアカウントを確認
2. `.env.local`に設定:
   ```
   SMTP_HOST=mail15.onamae.ne.jp
   SMTP_PORT=587
   SMTP_USER=contact@dp-guild.com
   SMTP_PASS=!.v-zF9kWZBe82u
   SMTP_SECURE=false
   COMPANY_EMAIL=contact@dp-guild.com
   COMPANY_NAME=株式会社DP-GUILD
   ```

#### オプション B: Resend（API型サービス）
新規でセットアップする場合：

1. [Resend](https://resend.com)でアカウント作成
2. ドメインを登録・認証
3. API Keyを取得
4. `.env.local`に設定:
   ```
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx
   COMPANY_EMAIL=info@dp-guild.co.jp
   COMPANY_NAME=株式会社DP-GUILD
   ```

### 2. Supabase（データベース）
1. [Supabase](https://supabase.com)でプロジェクト作成
2. `docs/supabase-setup.sql`を実行してテーブル作成
3. 環境変数を`.env.local`に設定:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### 3. Slack通知（オプション）
1. Slackワークスペースでアプリを作成
2. Incoming Webhookを有効化
3. Webhook URLを取得
4. `.env.local`に設定:
   ```
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX
   ```

## 環境変数設定

`.env.local.example`をコピーして`.env.local`を作成し、取得した値を設定してください。

```bash
cp .env.local.example .env.local
```

## 機能

### 実装済み機能
- ✅ フォームバリデーション（Zod）
- ✅ スパム対策（ハニーポット・時間チェック）
- ✅ 自動返信メール
- ✅ 社内通知メール
- ✅ Slack通知
- ✅ データベース保存
- ✅ レスポンシブデザイン
- ✅ アクセシビリティ対応

### フォーム項目
- 氏名（必須）
- メールアドレス（必須）
- 会社名（任意）
- 要件・相談内容（必須、10-2000文字）
- 参考URL（任意）

### エラーハンドリング
- バリデーションエラー
- ネットワークエラー
- サーバーエラー
- 環境変数未設定時のグレースフルデグラデーション

## 注意事項

1. **環境変数がすべて設定されていなくても動作します**
   - 設定されていない機能はスキップされます
   - エラーログに記録されます

2. **セキュリティ**
   - Service Role Keyは本番環境でのみ使用
   - Webhook URLは外部に漏らさない

3. **メール配信**
   - Resendのドメイン認証が必要
   - 送信制限に注意

4. **データベース**
   - RLS（Row Level Security）が有効
   - 管理画面での確認が可能

## トラブルシューティング

### よくある問題

1. **フォーム送信でエラーが出る**
   - ブラウザのコンソールでエラーを確認
   - API Routeのログを確認
   - 環境変数が正しく設定されているか確認

2. **メールが届かない**
   - Resendのドメイン認証状況を確認
   - スパムフォルダを確認
   - API Keyが正しいか確認

3. **Slack通知が来ない**
   - Webhook URLが正しいか確認
   - Slackアプリの権限を確認

4. **データベースに保存されない**
   - Supabaseの接続設定を確認
   - テーブルが作成されているか確認
   - RLSポリシーを確認

### ログの確認

開発環境では、ブラウザのコンソールと、ターミナルでサーバーログを確認してください。