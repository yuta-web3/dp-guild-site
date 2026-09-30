# サイトの作り（現物の地図）

最終更新: 2026-09-30 ／ 枝: feature/legal-pages（未push）

**作業の前にこれを読む。ここに書いてあることは、いちいちコードを見て確かめ直さない。**
コードを変えたら、同じコミットでこのファイルも直す。ここが古いと、次の作業が全部ずれる。

考え方・決めたこと（なぜそうするか）は「サイト設計マップ」https://claude.ai/artifact/LhQjSgtXuYqTb39s58FjjS が正。
このファイルは「いま何がどう作ってあるか」だけを書く。

---

## 1. ページの一覧

| URL | ゴール | 部品 | CSS | 送信先 | 状態 |
|---|---|---|---|---|---|
| `/` トップ | **会社案内の資料請求** | components/top/TopPage.tsx | app/lp-base.css ＋ app/top.css | `/api/document`（service 無し＝会社案内） | 作り直し済み・未公開 |
| `/services/[slug]` サービスページ | **そのサービスの資料請求** | components/service/ServicePage.tsx | app/lp-base.css | `/api/document`（service＝slug） | 型は完成。中身は instagram-feed の1件だけ |
| `/needs/[slug]`（attract / sell / improve） | 相談 | components/need/NeedPage.tsx | lp-base ＋ top ＋ need.css | `/api/contact` | 9月前半の用件別ページ。いまの計画では使っていない |
| `/lp/kensho` 検証パッケージLP | 無料相談 | components/lp/KenshoPage.tsx | lp-base ＋ kensho.css | `/api/contact` | 公開済み（main に別セッションで push）。noindex |
| `/about` `/contact` `/results` `/blog` | — | 各 app/…/*Client.tsx | globals.css（古い作り） | contact は `/api/contact` | 古いまま。作り直すか未決 |
| `/privacy` `/terms` `/tokushoho` | — | components/LegalLayout.tsx | — | — | privacy のみ公開済み |

- ヘッダーは全ページ共通の1種類：components/SiteHeader.tsx（＋site-header.css）
- 全体の設定・構造化データ：app/layout.tsx。サイトマップ：app/sitemap.ts

## 2. 資料請求フォーム（トップとサービスページで共通）

- **置き方は同じ。**どちらも `aside.rail > form.card`。画面の**右端に縦いっぱいで貼り付いたパネル**（app/lp-base.css の `.lp .rail`：position:fixed; top/right/bottom:0）。狭い画面では本文の下に回る（同ファイルの media 指定）
- 入力項目：会社名・サイトURL（任意）・お名前・メール・電話（任意）。チェックは lib/document-schema.ts
- 受け口：app/api/document/route.ts
  - `service` 無し → 会社案内（`COMPANY_DOC`、いまは doc: null）
  - `service` あり → lib/services.ts のその1件。`doc` があれば `/docs/<doc>` のURLを返信メールに入れる。null なら「担当から送る」表示＋社内通知に警告
  - 保存：Supabase `inquiries`（status = document_request）／メール：Resend／通知：Slack（任意）
- スパム対策：見えない入力欄（honeypot）＋表示から3秒未満の送信を弾く
- 詳細は docs/SERVICE_PAGES.md

## 3. トップページ（components/top/TopPage.tsx）

上から：ファーストビュー（本文の要約）→ 資料請求パネル（右端）→ 見た目の外側でやっていること → やってきたこと（#works）→ 誰がやるか（代表の写真と経歴）→ 会社のこと → フッター

| 中身 | データ |
|---|---|
| 実績カード・種類の絞り込み | lib/works.ts（works・workKinds・beyond） |
| 代表の経歴・会社情報 | lib/top-cases.ts（ceoCareer・company） |

- lib/cases.ts は**使っていない**（古い）
- 実績の文言の正は 本社 営業/実績/実績マスター.md。works.ts はそこから書く

## 4. サービスページ（components/service/ServicePage.tsx）

- **器は1枚。中身は lib/services.ts のデータ1件。**1件足せば1ページ増える（`generateStaticParams`）
- 上から：ファーストビュー → 資料請求パネル（右端）→ こんな状態ではありませんか → 何が変わるか → 何をお渡しするか → 含まないもの → 進め方 → 料金 → よくある質問 → お客様の声（voice が null なら出ない）→ フッター
- データの項目（`Service` 型）：slug, label, metaTitle, metaDescription, title[2], titleHighlight（title[1] に含まれる語）, lede, termline, price, priceNote, delivery, period, points, problems, gains, deliverables, excludes, steps, planItems, planNote, faq, voice, doc
- **いま入っているのは `instagram-feed` の1件だけ。これがサービスページの型。**やめない・古くない
  - 9/30 の計画で、Instagram初期構築は「集客」「採用」の2ページに分ける（中身とURLを分けるだけで、器はこのまま）
  - 今の voice（「サービス業／滋賀県」）は裏付けが無いので外す予定

## 5. デザインの指示（docs/）

| ファイル | 何か | 使い方 |
|---|---|---|
| DESIGN_PROMPT.md | 石井さんが書いた原文（トップ用・9/4） | **サービスページもこれ。書き換えない**。併せて伝える決まりが末尾にある |
| SERVICE_PAGES.md | サービスページの仕様と「やらないこと」 | 資料請求を見出しより目立たせる、価格をカウントアップしない 等 |
| DESIGN_PROMPT_LP.md | 検証パッケージLP用 | サービスページには使わない |
| SLIDE_PROMPT.md | 会社案内スライド用 | — |

方針（9/30）：技術とデザインは日本一。ただし**アート＜マーケティング**。読みやすさとストーリーは残す。

## 6. 公開まわり

- 作業枝 feature/legal-pages は未push。main には別セッションの検証パッケージLPが入っている（作業フォルダは ~/Projects/HP_DP-GUILD/dp-guild-site-lp-release）
- 合わせるとき：privacy と LegalLayout は **main 側が正**
- 公開は「サービスページまで作ってから、まとめて」（9/30 石井さん）
- 確認：`npm run build` → `npx next start -p 3000`。画面は 1280×720／900×620／390×700 で見る
