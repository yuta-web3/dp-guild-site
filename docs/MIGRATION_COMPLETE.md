# dp-guild.com 移行完了レポート

**実施日**: 2026-01-03
**ステータス**: ✅ 完了

---

## 1. 実施内容

### DNS移行（お名前.com → Cloudflare）

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | Cloudflareでドメイン追加 | ✅ 完了 |
| Phase 2 | DNSレコード確認・修正 | ✅ 完了 |
| Phase 3 | ネームサーバー変更 | ✅ 完了 |
| Phase 4 | Cloudflare Pagesカスタムドメイン設定 | ✅ 完了 |
| Phase 5 | 動作確認 | ✅ 完了 |

### Webホスティング移行（Studio → Cloudflare Pages）

- GitHub自動デプロイ設定済み
- カスタムドメイン設定済み
- SSL証明書自動発行済み

---

## 2. 現在の構成

```
dp-guild.com（お名前.comでドメイン維持）
    │
    │ ネームサーバー
    ↓
Cloudflare DNS
    │
    ├── Webサイト
    │   └── CNAME → dp-guild-site.pages.dev
    │       └── Cloudflare Pages（GitHub自動デプロイ）
    │
    ├── メール（Google Workspace）
    │   ├── MX → smtp.google.com
    │   ├── TXT → SPF (v=spf1 include:_spf.google.com -all)
    │   ├── TXT → DKIM (default._domainkey)
    │   └── TXT → DMARC (v=DMARC1; p=none;)
    │
    └── フォーム送信（Resend）
        └── TXT → DKIM (resend._domainkey)
```

---

## 3. Cloudflareネームサーバー

```
bjorn.ns.cloudflare.com
elaine.ns.cloudflare.com
```

---

## 4. Cloudflare Pages 環境変数

| 変数名 | 用途 |
|--------|------|
| RESEND_API_KEY | お問い合わせフォームのメール送信 |
| MICROCMS_SERVICE_DOMAIN | ブログCMS連携 |
| MICROCMS_API_KEY | ブログCMS連携 |

---

## 5. 動作確認結果

| 項目 | 状態 |
|------|------|
| https://dp-guild.com/ 表示 | ✅ |
| https://www.dp-guild.com/ 表示 | ✅ |
| SSL証明書 | ✅ 有効 |
| メール受信（Google Workspace） | ✅ |
| メール送信（Google Workspace） | ✅ |
| お問い合わせフォーム（Resend） | ✅ |
| ブログ機能（microCMS） | ✅ |

---

## 6. 解約済み・解約可能サービス

| サービス | 状態 | 備考 |
|----------|------|------|
| お名前.com ドメイン契約 | 維持 | ドメイン所有に必要 |
| お名前.com サーバー契約 | ✅ **解約済み** | 不要になった |
| Studio | 解約可能 | Cloudflare Pagesに移行済み |

---

## 7. コスト削減効果

### Before
- お名前.com ドメイン: 継続
- お名前.com サーバー: 月額費用あり
- Studio: 月額費用あり

### After
- お名前.com ドメイン: 継続
- Cloudflare DNS: **無料**
- Cloudflare Pages: **無料**（Freeプラン）

---

## 8. 今後の運用

### デプロイ方法
```bash
git push origin main
# → Cloudflare Pagesが自動でビルド・デプロイ
```

### 管理画面

| サービス | URL |
|----------|-----|
| Cloudflare | https://dash.cloudflare.com/ |
| GitHub | https://github.com/yuta-web3/dp-guild-site |
| microCMS | https://dp-guild.microcms.io/ |
| Resend | https://resend.com/emails |
| Google Workspace | https://admin.google.com/ |

---

## 9. ロールバック手順（緊急時）

万が一問題が発生した場合：

1. **お名前.com ドメインnavi**にログイン
2. ネームサーバーを元に戻す：
   - `ns-rs1.gmoserver.jp`
   - `ns-rs2.gmoserver.jp`
3. 反映まで最大48時間（通常は数時間）

※ ただしサーバー契約は解約済みのため、完全な復旧には再契約が必要

---

## 10. 関連ドキュメント

- [DNS移行計画書](./DNS_MIGRATION_PLAN.md)
- [DNS構成](./DNS_CONFIG.md)

---

**移行作業完了 - 2026-01-03**
