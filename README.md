# DP-GUILD コーポレートサイト

DP-GUILDの公式Webサイト。Next.js 15 + Cloudflare Pagesで構築。

## 技術スタック

- **フレームワーク**: Next.js 15.5.2 (App Router)
- **スタイリング**: Tailwind CSS
- **CMS**: microCMS
- **ホスティング**: Cloudflare Pages
- **アニメーション**: Framer Motion

## 開発環境

```bash
# 依存関係インストール
npm install

# 開発サーバー起動（Turbopack）
npm run dev

# ビルド
npm run build

# Cloudflare Pages用ビルド
npm run pages:build
```

開発サーバー: http://localhost:3000

## 環境変数

`.env.local` に以下を設定:

```
MICROCMS_SERVICE_DOMAIN=your-service-domain
MICROCMS_API_KEY=your-api-key
```

## デプロイ構成

```
GitHub (yuta-web3/dp-guild-site)
    │
    │ main ブランチへ push
    ↓
Cloudflare Pages（自動ビルド・デプロイ）
    │
    ↓
公開URL: https://dp-guild-site.pages.dev
```

### 自動デプロイ

- **トリガー**: `main` ブランチへのpush
- **ビルドコマンド**: `npm run build`
- **出力ディレクトリ**: `.vercel/output/static`

### カスタムドメイン設定

1. Cloudflare Pages ダッシュボードにアクセス
2. 「カスタムドメイン」タブを選択
3. 「カスタムドメインを設定」をクリック
4. 取得済みのドメインを入力
5. DNSレコードを設定（CloudflareでDNS管理している場合は自動）

## ディレクトリ構成

```
dp-guild-site/
├── app/                    # Next.js App Router
│   ├── page.tsx           # トップページ
│   ├── about/             # 会社概要
│   ├── blog/              # ブログ
│   │   ├── page.tsx       # 一覧ページ
│   │   └── [id]/          # 詳細ページ
│   ├── contact/           # お問い合わせ
│   ├── results/           # 実績・事例
│   └── api/               # APIルート
├── lib/                   # ユーティリティ
│   └── microcms.ts        # microCMSクライアント
├── wrangler.toml          # Cloudflare設定
└── package.json
```

## ブログ機能（microCMS連携）

### 必須フィールド

| フィールド | フィールドID | 用途 |
|-----------|-------------|------|
| タイトル | `title` | 記事タイトル |
| 概要 | `description` | meta description |
| アイキャッチ | `eyecatch` | サムネイル画像 |
| カテゴリ | `category` | 記事分類 |
| TL;DR | `tldr` | 要点（改行区切り5項目） |
| 内容 | `content` | 本文HTML |
| FAQ | `faq` | よくある質問（繰り返し） |

### 表示要素

- TL;DRボックス（本文前）
- FAQセクション + JSON-LD構造化データ
- CTAセクション（FAQ直後）

## リンク

- **本番URL**: https://dp-guild-site.pages.dev
- **GitHub**: https://github.com/yuta-web3/dp-guild-site
- **microCMS管理画面**: https://dp-guild.microcms.io
