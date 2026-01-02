# デプロイログ - DP-GUILD サイト

**最終更新**: 2025-10-10

---

## 完了したこと ✅

### 1. Netlify設定ファイルの作成
- `netlify.toml` を作成
- ビルドコマンド: `npm run build`
- 公開ディレクトリ: `.next`
- Next.jsランタイムプラグインを設定

### 2. GitHubリポジトリの作成とプッシュ
- リポジトリURL: https://github.com/yuta-web3/dp-guild-site
- ローカルの変更をコミット
- GitHub CLIでリポジトリ作成
- `main`ブランチにプッシュ完了

### 3. NetlifyとGitHubの連携
- Netlifyアカウントにログイン
- GitHubリポジトリと連携
- 自動ビルド＆デプロイ設定完了

### 4. 初回デプロイ成功
- デプロイ日時: 2025-10-10 16:56
- 公開URL: **https://dp-guild-site.netlify.app**
- ステータス: Published ✅

---

## これからやること 📋

### 優先度: 高

#### 1. サイトの動作確認
- [ ] https://dp-guild-site.netlify.app にアクセス
- [ ] 全ページが正しく表示されるか確認
  - [ ] トップページ
  - [ ] Aboutページ
  - [ ] Resultsページ
  - [ ] Contactページ
- [ ] 画像の表示確認
- [ ] レスポンシブデザインの確認（モバイル/タブレット/PC）

#### 2. 環境変数の設定
Netlify管理画面で以下の環境変数を追加：

**設定場所**: Site configuration → Environment variables

必要な環境変数（`.env.local`を参照）:
```bash
# Notion設定（実績ページ用）
NOTION_SECRET=secret_xxxxxxxxxxxxx
NOTION_WORKS_DB_ID=xxxxxxxxxxxxxxx

# メール設定（お問い合わせフォーム用）
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
SMTP_FROM=noreply@dp-guild.com
NOTIFICATION_EMAIL=contact@dp-guild.com

# Supabase設定（お問い合わせフォーム保存用）
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# サイト設定
NEXT_PUBLIC_SITE_URL=https://dp-guild-site.netlify.app
```

**設定後の対応**:
- [ ] 環境変数追加後、再デプロイ（自動or手動）
- [ ] お問い合わせフォームの動作確認
- [ ] メール送信テスト

#### 3. ビルド警告の修正
以下の警告が出ているので、時間があるときに修正：

**画像最適化の警告**:
- [ ] `app/about/page.tsx` (447, 483, 847行目)
- [ ] `app/page.tsx` (85, 942行目)
- [ ] `app/results/page.tsx` (378行目)
- 対応: `<img>` → Next.jsの `<Image />` コンポーネントに変更

**useEffect依存関係の警告**:
- [ ] `app/about/page.tsx` (224行目)
- [ ] `app/page.tsx` (117行目)
- [ ] `app/results/page.tsx` (328行目)
- 対応: `elementRef.current`や`cardRef.current`を変数に保存してcleanup関数で使用

---

### 優先度: 中

#### 4. 独自ドメインの設定
現在のURL: `https://dp-guild-site.netlify.app`

独自ドメインを取得・設定する場合:
- [ ] ドメインを取得（例: dp-guild.com）
- [ ] Netlify管理画面で「Set up a custom domain」から設定
- [ ] DNSレコードの設定
- [ ] SSL証明書の自動発行確認（Let's Encrypt）
- [ ] 環境変数 `NEXT_PUBLIC_SITE_URL` を独自ドメインに更新

#### 5. パフォーマンス最適化
- [ ] Lighthouseでパフォーマンス測定
- [ ] 画像の最適化（webp/avif形式への変換）
- [ ] 不要なJavaScriptの削減
- [ ] フォントの最適化

#### 6. SEO対策
- [ ] Google Search Consoleへの登録
- [ ] サイトマップの生成と送信
- [ ] robots.txtの確認
- [ ] OGP画像の設定確認
- [ ] メタデータの最適化

---

### 優先度: 低（将来的な拡張）

#### 7. 監視・分析の設定
- [ ] Google Analytics 4の設定
- [ ] Netlify Analyticsの有効化（有料プラン）
- [ ] エラー監視ツールの導入（Sentry等）

#### 8. CI/CDの強化
- [ ] GitHub Actionsでのテスト自動化
- [ ] プレビューデプロイの活用（PRごと）
- [ ] Lighthouseスコアの自動測定

#### 9. セキュリティ強化
- [ ] セキュリティヘッダーの確認
- [ ] CSPポリシーの最適化
- [ ] 定期的な依存関係の更新

---

## 自動デプロイの仕組み

### 現在の設定
- **トリガー**: `main`ブランチへのpush
- **ビルド**: Netlifyが自動的に`npm run build`を実行
- **デプロイ**: ビルド成功後、自動的に本番環境へデプロイ

### デプロイ手順
```bash
# 1. コードを修正
# 2. 変更をコミット
git add .
git commit -m "修正内容"

# 3. GitHubにプッシュ（自動デプロイが開始される）
git push origin main

# 4. Netlify管理画面でデプロイ状況を確認
# https://app.netlify.com
```

---

## トラブルシューティング

### ビルドが失敗する場合
1. Netlify管理画面の「Deploys」→失敗したデプロイをクリック
2. ビルドログを確認
3. ローカルで`npm run build`を実行して同じエラーが出るか確認
4. エラーを修正してpush

### 環境変数が反映されない場合
1. Netlify管理画面で環境変数が正しく設定されているか確認
2. 環境変数追加後、手動で再デプロイ
3. ブラウザのキャッシュをクリア

### ページが404エラーになる場合
- `netlify.toml`のリダイレクト設定を確認
- Next.jsのページが正しくビルドされているか確認

---

## 参考リンク

- **サイトURL**: https://dp-guild-site.netlify.app
- **GitHubリポジトリ**: https://github.com/yuta-web3/dp-guild-site
- **Netlify管理画面**: https://app.netlify.com
- **Netlify Docs**: https://docs.netlify.com
- **Next.js on Netlify**: https://docs.netlify.com/frameworks/next-js/overview/

---

## メモ

### プロジェクト情報
- フレームワーク: Next.js 15.5.4
- Node.jsバージョン: 20
- デプロイ方法: GitHub連携による自動デプロイ

### 注意事項
- `.env.local`ファイルは機密情報を含むため、Gitにコミットしない（`.gitignore`に追加済み）
- 環境変数はNetlify管理画面で設定する
- ビルド時の警告は機能に影響しないが、時間があるときに修正推奨
