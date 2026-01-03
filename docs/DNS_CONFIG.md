# dp-guild.com DNS構成

最終更新: 2026-01-03

## ドメイン情報

- **ドメイン**: dp-guild.com
- **レジストラ**: お名前.com
- **ネームサーバー**: ns-rs1.gmoserver.jp, ns-rs2.gmoserver.jp

---

## 絶対に変更禁止（メール関連）

| タイプ | ホスト名 | 値 | 用途 |
|--------|----------|-----|------|
| MX | dp-guild.com | smtp.google.com (優先度1) | Google Workspace メール受信 |
| TXT | dp-guild.com | `v=spf1 include:_spf.google.com -all` | SPF（メール認証） |
| TXT | default._domainkey.dp-guild.com | `v=DKIM1; k=rsa; p=MIIBIjAN...` | DKIM（Google署名） |
| TXT | _dmarc.dp-guild.com | `v=DMARC1; p=none;` | DMARC（メールポリシー） |
| TXT | resend._domainkey.dp-guild.com | `p=MIGfMA0GCSqGSIb3...` | Resend DKIM（フォーム送信用） |
| TXT | dp-guild.com | `google-site-verification=zoJky...` | Google Search Console確認 |

---

## Webサイト（変更対象）

### 変更前（Studio）
| タイプ | ホスト名 | 値 |
|--------|----------|-----|
| A | dp-guild.com | 34.111.141.225 |
| A | www.dp-guild.com | 34.111.141.225 |

### 変更後（Cloudflare Pages）
| タイプ | ホスト名 | 値 |
|--------|----------|-----|
| CNAME | dp-guild.com | dp-guild-site.pages.dev |
| CNAME | www.dp-guild.com | dp-guild-site.pages.dev |

---

## 削除予定（未使用）

| タイプ | ホスト名 | 値 | 理由 |
|--------|----------|-----|------|
| A | lp.dp-guild.com | 150.95.219.153 | LP未使用 |
| A | www.lp.dp-guild.com | 150.95.219.153 | LP未使用 |
| TXT | lp.dp-guild.com | SPF (onamae) | LP未使用 |
| TXT | default._domainkey.lp.dp-guild.com | DKIM | LP未使用 |
| A | mail.dp-guild.com | 157.120.209.45 | お名前メール未契約 |
| A | mail.lp.dp-guild.com | 157.120.209.45 | 未使用 |
| A | ml-cp.dp-guild.com | 157.120.209.45 | お名前メール未契約 |
| A | ml-cp.lp.dp-guild.com | 157.120.209.45 | 未使用 |
| MX | send.dp-guild.com | amazonses.com | AWS SES未使用 |
| TXT | send.dp-guild.com | SPF (amazonses) | AWS SES未使用 |

---

## 現在のサービス構成

```
dp-guild.com
├── Webサイト
│   ├── 現在: Studio (34.111.141.225)
│   └── 移行先: Cloudflare Pages (dp-guild-site.pages.dev)
│
├── メール（Google Workspace）
│   ├── 受信: MX → smtp.google.com
│   ├── 認証: SPF, DKIM, DMARC
│   └── 変更しない
│
└── お問い合わせフォーム
    ├── 送信: Resend API
    ├── DKIM: resend._domainkey.dp-guild.com
    └── 変更しない
```

---

## 切り替え手順

1. Cloudflare Pagesでカスタムドメイン追加
2. お名前.comでDNSレコード変更
   - `dp-guild.com` A → CNAME `dp-guild-site.pages.dev`
   - `www.dp-guild.com` A → CNAME `dp-guild-site.pages.dev`
3. 反映待ち（数分〜数時間）
4. 動作確認（サイト表示、メール送受信）
5. 問題なければ不要レコード削除

---

## 緊急時の復旧

Studio に戻す場合:
- `dp-guild.com` → A `34.111.141.225`
- `www.dp-guild.com` → A `34.111.141.225`
