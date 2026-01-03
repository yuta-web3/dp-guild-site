# dp-guild.com DNS移行計画書

**作成日**: 2026-01-03
**最終更新**: 2026-01-03
**目的**: お名前.comサーバー → Cloudflare DNSへの移行
**効果**: お名前.comサーバー契約の解約が可能に

---

## 🚀 移行進捗状況

| Phase | 内容 | 状態 |
|-------|------|------|
| Phase 1 | Cloudflareでドメイン追加 | ✅ 完了 |
| Phase 2 | DNSレコード確認・修正 | ✅ 完了 |
| Phase 3 | ネームサーバー変更 | ✅ 完了 |
| Phase 4 | Cloudflare Pagesカスタムドメイン設定 | ✅ 完了 |
| Phase 5 | 動作確認 | ✅ 完了 |

### Cloudflareネームサーバー（割り当て済み）
```
bjorn.ns.cloudflare.com
elaine.ns.cloudflare.com
```

### Cloudflare Pagesカスタムドメイン設定
| ドメイン | 変更前 | 変更後 | 状態 |
|----------|--------|--------|------|
| dp-guild.com | A → 34.111.141.225 | CNAME → dp-guild-site.pages.dev | ✅ アクティブ |
| www.dp-guild.com | A → 34.111.141.225 | CNAME → dp-guild-site.pages.dev | ✅ アクティブ |

### Cloudflareに設定済みのDNSレコード
| タイプ | 名前 | 内容 | 状態 |
|--------|------|------|------|
| CNAME | dp-guild.com | dp-guild-site.pages.dev | ✅ |
| CNAME | www | dp-guild-site.pages.dev | ✅ |
| MX | dp-guild.com | smtp.google.com (1) | ✅ |
| NS | dp-guild.com | (Cloudflareが自動設定) | ✅ |
| TXT | default._domainkey | Google DKIM | ✅ |
| TXT | _dmarc | v=DMARC1; p=none; | ✅ |
| TXT | dp-guild.com | SPF (Google) | ✅ |
| TXT | dp-guild.com | google-site-verification | ✅ |
| TXT | resend._domainkey | Resend DKIM | ✅ |

### 削除済みレコード（4件）
- ~~A | lp~~ ❌
- ~~A | mail~~ ❌
- ~~MX | send~~ ❌
- ~~TXT | send~~ ❌

---

## 1. 現在のDNSレコード一覧（全18件）

### 1-1. 移行必須（メール・認証系）- 6件

| # | タイプ | ホスト名 | TTL | 値 | 用途 |
|---|--------|----------|-----|-----|------|
| 1 | MX | dp-guild.com | 600 | smtp.google.com（優先度: 1） | Google Workspace メール受信 |
| 2 | TXT | dp-guild.com | 600 | `v=spf1 include:_spf.google.com -all` | SPF（メール認証） |
| 3 | TXT | default._domainkey.dp-guild.com | 600 | `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxNeMuUsozGxSPsBgostXWqKzoK7labkFOI92xGg1zLF2Deg3+k5XYXp0h5uUTs5330IK089b9wuNvLQMKBs9WL9AbZx+2HRNU1s2A4/whR7tQYxX+7v+N7npp0Xo3i2L3WP/yJjEJJdSaUzHNluZkxWw+lBAnQOBVkQzyKCR7lgCnbInge//EKqFi6dbQQi2M0jkM4UiuOfq+grMbB2fZxjvIjC5wghJCaCHISUDsnyHkPHhdMfNLIFjIpgXEhPK8LUmSdYCG1JK/Sg7KUcc8b4IYII0YzMsdAJ4pqj73bFNtYO+VwMp7Uqs21QlEAteVrgqRua9QEPQ6dJcxSza3QIDAQAB` | DKIM（Google署名） |
| 4 | TXT | _dmarc.dp-guild.com | 600 | `v=DMARC1; p=none;` | DMARC（メールポリシー） |
| 5 | TXT | resend._domainkey.dp-guild.com | 600 | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTq5t3istBTlLVw0r1IcXjh8+f4aoA2pMtwpayq6mfLtZJT4d173zNkpFPaSupuGt01DOx9RoyVLz4BVChxvdEsCE48EtaOrY3MYgUqKQLRC5klRByExahT1hulE+nySut5uObo1KsR9xBxwZYmUb95MXE1E39Mx4CVpjMZ5wYHQIDAQAB` | DKIM（Resend送信） |
| 6 | TXT | dp-guild.com | 600 | `google-site-verification=zoJkyRxZaiLQ8vQGOXIo5YQ4gX1Je7WdpTILIF7xgUw` | Google Search Console |

### 1-2. Webサイト（Cloudflare Pagesが自動設定）- 2件

| # | タイプ | ホスト名 | TTL | 現在の値 | 移行後 |
|---|--------|----------|-----|----------|--------|
| 7 | A | dp-guild.com | 600 | 34.111.141.225（Studio） | Cloudflare Pages が自動設定 |
| 8 | A | www.dp-guild.com | 600 | 34.111.141.225（Studio） | Cloudflare Pages が自動設定 |

### 1-3. 削除（未使用）- 10件

| # | タイプ | ホスト名 | TTL | 値 | 削除理由 |
|---|--------|----------|-----|-----|----------|
| 9 | TXT | default._domainkey.lp.dp-guild.com | 600 | (DKIM) | LP未使用 |
| 10 | TXT | lp.dp-guild.com | 600 | `v=spf1 include:_spf.onamae.ne.jp ~all` | LP未使用 |
| 11 | A | lp.dp-guild.com | 600 | 150.95.219.153 | LP未使用 |
| 12 | A | www.lp.dp-guild.com | 600 | 150.95.219.153 | LP未使用 |
| 13 | A | mail.dp-guild.com | 600 | 157.120.209.45 | お名前メール未契約 |
| 14 | A | mail.lp.dp-guild.com | 600 | 157.120.209.45 | LP未使用 |
| 15 | A | ml-cp.dp-guild.com | 600 | 157.120.209.45 | お名前メール未契約 |
| 16 | A | ml-cp.lp.dp-guild.com | 600 | 157.120.209.45 | LP未使用 |
| 17 | MX | send.dp-guild.com | 600 | feedback-smtp.ap-northeast-1.amazonses.com（優先度: 10） | AWS SES未使用 |
| 18 | TXT | send.dp-guild.com | 600 | `v=spf1 include:amazonses.com ~all` | AWS SES未使用 |

---

## 2. 移行手順

### Phase 1: Cloudflareでドメイン追加（所要時間: 5分）

1. **Cloudflareダッシュボードにログイン**
   - https://dash.cloudflare.com/

2. **「サイトを追加」をクリック**

3. **ドメイン入力**
   - `dp-guild.com` を入力

4. **プラン選択**
   - Free プランでOK

5. **DNSレコードのスキャン**
   - Cloudflareが自動で現在のレコードを検出
   - **重要**: 検出結果を次のPhase 2で確認

---

### Phase 2: DNSレコードの確認・修正（所要時間: 15分）

Cloudflareが検出したレコードを確認し、以下の状態にする。

#### 追加するレコード（必須6件）

| タイプ | 名前 | 内容 | プロキシ |
|--------|------|------|----------|
| MX | @ | smtp.google.com（優先度: 1） | - |
| TXT | @ | `v=spf1 include:_spf.google.com -all` | - |
| TXT | default._domainkey | `v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAxNeMuUsozGxSPsBgostXWqKzoK7labkFOI92xGg1zLF2Deg3+k5XYXp0h5uUTs5330IK089b9wuNvLQMKBs9WL9AbZx+2HRNU1s2A4/whR7tQYxX+7v+N7npp0Xo3i2L3WP/yJjEJJdSaUzHNluZkxWw+lBAnQOBVkQzyKCR7lgCnbInge//EKqFi6dbQQi2M0jkM4UiuOfq+grMbB2fZxjvIjC5wghJCaCHISUDsnyHkPHhdMfNLIFjIpgXEhPK8LUmSdYCG1JK/Sg7KUcc8b4IYII0YzMsdAJ4pqj73bFNtYO+VwMp7Uqs21QlEAteVrgqRua9QEPQ6dJcxSza3QIDAQAB` | - |
| TXT | _dmarc | `v=DMARC1; p=none;` | - |
| TXT | resend._domainkey | `p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTq5t3istBTlLVw0r1IcXjh8+f4aoA2pMtwpayq6mfLtZJT4d173zNkpFPaSupuGt01DOx9RoyVLz4BVChxvdEsCE48EtaOrY3MYgUqKQLRC5klRByExahT1hulE+nySut5uObo1KsR9xBxwZYmUb95MXE1E39Mx4CVpjMZ5wYHQIDAQAB` | - |
| TXT | @ | `google-site-verification=zoJkyRxZaiLQ8vQGOXIo5YQ4gX1Je7WdpTILIF7xgUw` | - |

#### Webサイト用レコード（Cloudflare Pagesが後で自動追加）

- `dp-guild.com` と `www.dp-guild.com` のAレコードは一旦削除してOK
- Phase 4でCloudflare Pagesがカスタムドメイン設定時に自動追加する

#### 削除するレコード（未使用10件）

以下のレコードがCloudflareに検出されていたら削除：
- `lp.dp-guild.com` 関連すべて
- `mail.dp-guild.com`
- `mail.lp.dp-guild.com`
- `ml-cp.dp-guild.com`
- `ml-cp.lp.dp-guild.com`
- `send.dp-guild.com` 関連すべて

---

### Phase 3: ネームサーバー変更（所要時間: 5分 + 反映待ち最大48時間）

1. **Cloudflareが指定するネームサーバーをメモ**
   - 例: `xxx.ns.cloudflare.com`, `yyy.ns.cloudflare.com`

2. **お名前.com ドメインnavi にログイン**
   - https://navi.onamae.com/

3. **ネームサーバーの変更**
   - 「ドメイン」→「ネームサーバー設定」
   - 現在: `ns-rs1.gmoserver.jp`, `ns-rs2.gmoserver.jp`
   - 変更後: Cloudflareのネームサーバー

4. **反映を待つ**
   - 通常: 数分〜数時間
   - 最大: 48時間

5. **Cloudflareで確認**
   - ダッシュボードでステータスが「アクティブ」になればOK

---

### Phase 4: Cloudflare Pagesでカスタムドメイン設定（所要時間: 5分）

1. **Cloudflare Pages ダッシュボード**
   - Workers & Pages → dp-guild-site

2. **「カスタムドメイン」タブ**

3. **ドメイン追加**
   - `dp-guild.com` を追加
   - `www.dp-guild.com` を追加

4. **DNSレコード自動設定**
   - Cloudflareが自動でCNAMEまたはAレコードを追加

---

### Phase 5: 動作確認（所要時間: 30分）

#### Webサイト確認
- [ ] https://dp-guild.com/ にアクセスできる
- [ ] https://www.dp-guild.com/ にアクセスできる
- [ ] SSL証明書が有効（鍵マーク表示）
- [ ] 全ページが正常に表示される

#### メール確認（最重要）
- [ ] **受信テスト**: 外部から info@dp-guild.com にメール送信 → Gmailで受信できる
- [ ] **送信テスト**: Gmailから外部にメール送信 → 相手に届く
- [ ] **お問い合わせフォーム**: サイトのフォームから送信 → メールが届く

#### DNS確認コマンド（ターミナル）
```bash
# MXレコード確認
dig dp-guild.com MX +short
# 期待値: 1 smtp.google.com.

# SPF確認
dig dp-guild.com TXT +short | grep spf
# 期待値: "v=spf1 include:_spf.google.com -all"

# Webサイト確認
dig dp-guild.com A +short
# 期待値: Cloudflare PagesのIP
```

---

## 3. ロールバック手順（問題発生時）

### 3-1. ネームサーバーを戻す

1. お名前.com ドメインnavi
2. ネームサーバー設定
3. 元に戻す:
   - `ns-rs1.gmoserver.jp`
   - `ns-rs2.gmoserver.jp`

### 3-2. 復旧までの時間

- 最大48時間（DNS伝播）
- 実際は数時間で戻ることが多い

---

## 4. 移行後の構成

```
dp-guild.com（お名前.comで契約維持）
    │
    │ ネームサーバー
    ↓
Cloudflare DNS
    ├── MX → smtp.google.com（Google Workspace）
    ├── TXT → SPF, DKIM, DMARC（メール認証）
    ├── TXT → Resend DKIM（フォーム送信）
    └── A/CNAME → Cloudflare Pages（Webサイト）
            │
            ↓
        dp-guild-site.pages.dev
            │
            │ GitHubから自動デプロイ
            ↓
        GitHub: yuta-web3/dp-guild-site
```

---

## 5. 解約可能になるサービス

| サービス | 解約可否 | 理由 |
|----------|:--------:|------|
| お名前.com ドメイン契約 | ❌ | ドメイン維持に必要 |
| お名前.com サーバー契約 | ✅ | DNS移行後は不要 |
| Studio | ✅ | Cloudflare Pagesに移行 |

---

## 6. チェックリスト

### 移行前
- [ ] Cloudflareアカウント準備
- [ ] 現在のDNSレコードをバックアップ（このドキュメント）
- [ ] メール送受信が正常に動作していることを確認

### Phase 1-2（Cloudflare設定）
- [ ] Cloudflareにドメイン追加
- [ ] 必須レコード6件を確認・追加
- [ ] 不要レコード10件を削除

### Phase 3（ネームサーバー変更）
- [ ] Cloudflareのネームサーバーをメモ
- [ ] お名前.comでネームサーバー変更
- [ ] Cloudflareでアクティブ化を確認

### Phase 4（Cloudflare Pages）
- [ ] カスタムドメイン dp-guild.com 追加
- [ ] カスタムドメイン www.dp-guild.com 追加

### Phase 5（動作確認）
- [ ] Webサイト表示確認
- [ ] メール受信テスト
- [ ] メール送信テスト
- [ ] お問い合わせフォームテスト

### 移行完了後（1週間後目安）
- [ ] お名前.com サーバー契約解約
- [ ] Studio解約（必要なら）

---

## 7. 緊急連絡先

問題発生時:
- お名前.com サポート: 0120-014-660
- Cloudflare ステータス: https://www.cloudflarestatus.com/
- Google Workspace ステータス: https://www.google.com/appsstatus/dashboard/

---

**このドキュメントは移行完了まで保持すること**
