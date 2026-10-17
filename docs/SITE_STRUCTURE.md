# サイトの作り（現物の地図）

最終更新: 2026-10-03 ／ 枝: feature/legal-pages（未push）

**作業の前にこれを読む。ここに書いてあることは、いちいちコードを見て確かめ直さない。**
コードを変えたら、同じコミットでこのファイルも直す。ここが古いと、次の作業が全部ずれる。

考え方・決めたこと（なぜそうするか）は「サイト設計マップ」https://claude.ai/artifact/LhQjSgtXuYqTb39s58FjjS が正。
このファイルは「いま何がどう作ってあるか」だけを書く。

---

## 1. ページの一覧

| URL | ゴール | 部品 | CSS | 送信先 | 状態 |
|---|---|---|---|---|---|
| `/` トップ | **会社案内の資料請求** | components/top/TopPage.tsx | app/lp-base.css ＋ app/top.css | `/api/document`（service 無し＝会社案内） | 作り直し済み・未公開 |
| `/services/[slug]` サービスページ | **そのサービスの資料請求** | components/service/ServicePage.tsx | app/lp-base.css ＋ app/services/[slug]/service.css | `/api/document`（service＝slug） | 7ページ登録済み（10/1 夜に9→7）。未公開 |
| `/needs/[slug]`（attract / sell / improve） | 相談 | components/need/NeedPage.tsx | lp-base ＋ top ＋ need.css | `/api/contact` | 9月前半の用件別ページ。いまの計画では使っていない |
| `/lp/kensho` 検証パッケージLP | 無料相談 | components/lp/KenshoPage.tsx | lp-base ＋ kensho.css | `/api/contact` | 公開済み（main に別セッションで push）。noindex |
| `/about` `/contact` `/results` `/blog` | — | 各 app/…/*Client.tsx | globals.css（古い作り） | contact は `/api/contact` | 古いまま。作り直すか未決 |
| `/privacy` `/terms` `/tokushoho` | — | components/LegalLayout.tsx | — | — | privacy のみ公開済み |

- ヘッダーは全ページ共通の1種類：components/SiteHeader.tsx（＋site-header.css）
- 全体の設定・構造化データ：app/layout.tsx。サイトマップ：app/sitemap.ts
- ヘッダー・フッターの案内とサイトマップは §1.5

## 1.5 ヘッダー・フッターの案内とサイトマップ（2026-10-03 代表決定）

**「1ページ1ゴール・回遊させない」は、本文の中で他ページへのクリックを促さないという意味。**サイトにあるページは、ヘッダーとフッターで普通に案内する。本文（FV〜FAQ・資料請求パネル）には他ページへのリンクを足さない。

- 案内のサービス一覧は `app/layout.tsx` が `lib/services` の `serviceSlugs`（＝`list` の並び順）と `label` から作り、`components/SiteNav.tsx` の `SiteNavProvider` で全ページに渡す。**手で並べない。**`list` に1行足せば、ヘッダー・フッター・サイトマップに自動で出る
  - ヘッダー・フッターから `lib/services` を直接 import しない（サービス7本ぶんの文言 約170KB がブラウザ側のJSに入る）。layout から名前とURLだけを渡す
- **ヘッダー**（components/SiteHeader.tsx。サイト共通の1種類のまま）
  - PC：右側に「サービス ▾」（押すと7本の一覧が下に開く）・「会社案内」（/）・「お問い合わせ」（/contact）。控えめな文字のリンク（12px・薄い色）。資料請求パネルがいちばん目立つ、を崩さない
  - 一覧はボタンの右端にそろえて左へ開く。右端の資料請求パネル（`.rail`）に重ならない（1280幅でパネル左端920px・一覧の右端718px）
  - 右にパネルが無いページ（cta=true）は「相談する」ボタンが /contact なので、文字の「お問い合わせ」は出さない
  - スマホ（760px以下）：「メニュー」ボタン1つ。開くとサービス7本・会社案内・お問い合わせ。開いている間はヘッダーに白い板を敷き、下の固定バー（`.mbar`）より手前に出す
  - キーボード：ボタンは aria-expanded／aria-controls。Esc で閉じて押したボタンに戻る。Tab で外へ出たら閉じる。外を押しても閉じる。ページが変わったら閉じる
  - 今いるページは aria-current="page"（サービスページでは「サービス」も濃くする）
  - prefers-reduced-motion では開く動きを止める
- **フッター**（components/SiteNav.tsx の `SiteFooterNav`。見た目は components/site-footer.css）
  - トップ・サービスページの `lpfoot`：会社名・住所・メール → サービス7本（2列）｜会社（会社案内・お問い合わせ）→ **法務3ページ（利用規約・特商法・プライバシーポリシー）** → ©
  - 法務3ページ（components/LegalLayout.tsx）：既存のフッターに**サービス7本だけ**を1行で差し込んだ（`<SiteFooterNav only="services" />`）。LegalLayout は main 側が正なので、それ以外は変えていない
  - 記事・会社概要・実績・お問い合わせ（古い作り）のフッターは各ページに直書きで、まだサービスの案内は無い
- **サイトマップ**（app/sitemap.ts）：静的ページ＋**サービス7本（`serviceSlugs` から自動）**＋記事（microCMS）

## 2. 資料請求フォーム（トップとサービスページで共通）

- **置き方は同じ。**どちらも `aside.rail > form.card`。画面の**右端に縦いっぱいで貼り付いたパネル**（app/lp-base.css の `.lp .rail`：position:fixed; top/right/bottom:0）。狭い画面では本文の下に回る（同ファイルの media 指定）
- 入力項目：会社名・サイトURL（任意）・お名前・メール・電話（任意）。チェックは lib/document-schema.ts
  - サービスページでは必須3つ（会社名・お名前・メール）だけを出し、任意2つは「＋ サイトのURL・電話番号も伝える（任意）」に畳む。送る前に画面で必須・メールの形を確かめ、欄の下に日本語で理由を出す
- 受け口：app/api/document/route.ts
  - `service` 無し → 会社案内（`COMPANY_DOC`、いまは doc: null）
  - `service` あり → lib/services（lib/services/index.ts の `services`）のその1件。`doc` があれば `/docs/<doc>` のURLを返信メールに入れる。null なら「担当から送る」表示＋社内通知に警告
  - 保存：Supabase `inquiries`（status = document_request）／メール：Resend／通知：Slack（任意）
- スパム対策：見えない入力欄（honeypot）に入力があれば、成功に見せて何もしない／表示から3秒未満の送信は日本語の案内で弾く
- 返す文言は日本語だけ。入力の誤りは `{ error, field }`（400）で返し、画面はその欄の下に出す
- 保存（Supabase）とメール（Resend）の**両方を試して両方失敗**したら 500 と「info@dp-guild.com までメールで」の案内を返す（リードを黙って消さない）。どちらも未設定の環境（開発）は成功扱い
- 計測：送信が成功したら、GA4（gtag）が読み込まれているときだけ `gtag('event','generate_lead',{service: slug})` を送る。GA4 側でキーイベントに登録する（未登録）
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

- **器は1枚。中身は lib/services/<slug>.ts のデータ1件。**1ファイル足して lib/services/index.ts の `list` に1行足せば1ページ増える（`generateStaticParams`）
  - データの形：lib/services/types.ts（`Service` 型。10/1 決定）。各ファイルは `export const service` で出し、index.ts で別名にして読む
  - 読み込みは `@/lib/services`（index.ts が `services`・`serviceSlugs`・`getService` と型を出す）
  - 登録済み（10/1 夜・7本）と主の検索語（月間検索数は 本社 経営企画/リサーチ/2026-10-01_サービスページのキーワード調査.md）：

    | slug | ページ | 主の検索語 | 料金 |
    |---|---|---|---|
    | sns-management | SNS運用代行（集客）＋立ち上げだけ | SNS運用代行 相場（720）。インスタ運用代行も拾う。TikTokを受けることはFAQの1か所 | fixed（月額6＋立ち上げだけ2） |
    | sns-management-recruit | SNS採用の代行（運用代行＋立ち上げだけ） | SNS採用 代行（140）／SNS採用（720） | fixed（月額6＋立ち上げだけ2） |
    | website | ホームページ制作・リニューアル | ホームページ作成 費用（3,600）・ホームページ制作 会社（2,400） | quote |
    | landing-page | LP制作 | LP制作 相場（590）・LP制作 会社（390） | quote |
    | online-store | ECサイト構築（ネットショップ制作） | ECサイト構築（720）・Shopify 制作会社（320）。Shopifyの運用代行を受けることはFAQの1か所 | quote |
    | mobile-app | アプリ開発・改修 | アプリ開発 費用（1,000）・アプリ開発 会社 | quote |
    | business-system | システム開発・業務の自動化 | システム開発 会社（720） | quote |

  - **Instagram初期構築は単体ページをやめた**（10/1 代表決定。意思決定ログ 2026-08-15_Instagram初期構築_商品化と価格.md の10/01追記3）。中身は sns-management／sns-management-recruit の「立ち上げだけ」プラン（フィード20万円・動画30万円（税別）、モニター半額は集客・採用・これまでのお客様を通して先着5社）に統合。lib/services/instagram-launch.ts・instagram-launch-recruit.ts は削除
  - 転送（next.config.js・恒久 308）：`/services/instagram-feed`・`/services/instagram-launch` → `/services/sns-management`、`/services/instagram-launch-recruit` → `/services/sns-management-recruit`。lib/needs.ts の参照も sns-management に直した
  - **1ページ1ゴール：本文の中では、他のサービスページへのリンク・「〜はこちら」を置かない。**ヘッダー・フッターの案内（サービス7本・会社案内・お問い合わせ・法務3ページ）は置く（10/3 代表。§1.5）
  - fixed のページで月額と買い切りを並べるときは、プランの `unit` で「円／月（税別）」と「円（税別）」を書き分ける。`monitorAmount` は立ち上げだけの2プランだけ
  - **next.config.js が効いている**（next.config.ts もあるが、Next は .js を先に読む）
- 見た目はトップと同じ言語：右端の全高パネル（`.rail`）・ロゴの不可能立体（components/service/IsoCube.tsx。トップと同じ図形）・背景の格子
- CSS：共通は app/lp-base.css、サービス用の追加は app/services/[slug]/service.css（すべて `.lp.svc` 配下。トップ・他LPに効かない）
- 左の列の右端は1つ（`--col: min(860px,100%)`）。FV・本文・進め方の帯の中身をそろえる
- 上から：
  - ファーストビュー：立方体 → label → 見出し（title・titleHighlight）→ lede → termline（620px以下は出さない。FAQに同じ説明がある）→ **facts** →（モニター価格の一文。同じ金額が lede に無いときだけ）→ **実績の要約（proof の先頭2件。#proof へ）** → points → 「まだ決めなくて大丈夫です。まずは右の資料をご覧ください →」（ボタンではない一行。1041px以上だけ）
    - 620px以下は並びを変える：見出し・lede → **実績の要約** → facts → モニター価格の一文 → points（実績を1画面目に入れ、固定バーの下に隠さない）
    - 520px以下：モニター価格の一文は、パネルにも同じ一文があるときは1行に詰めて「…」で切る（全文はパネル側）。数字の無い実績の要約は、添え書きを1件目だけ・1行で「…」切り
  - 資料請求パネル（右端）：「無料の資料」→ docPitch.title と docPitch.items →（モニター価格の一文）→ 入力（必須3つ＋任意2つは畳む）→ 送信 → **送信後どうなるかの一行**（doc あり＝すぐ資料が開く・メールでもリンク／doc なし＝2営業日以内にメールで。route.ts の返信メールと同じ日数）。メールアドレスの案内は送信エラーのときだけ出す
  - 本文：01 こんな状態ではありませんか（concept があれば「考え方」、無ければ「このサービスで、こうなります」）→ 02 何が変わるか → **03 実績**（proof・proofNote）→ 04 何をお渡しするか → 05 含まないもの（空なら出ない）→ 06 進め方（steps が2つ以上なら切り替え。矢印キー可）→ 07 料金 → 08 よくある質問 → お客様の声（voice が null なら出ない）→ フッター
  - 番号は出したものだけで詰めて振る
- 実績の数字：proof の t か d にある「150万回」「6万回以上」「1,000本以上」などは等幅の太字で目立たせる。FV の要約は、t に数字が無ければ d から数字のかたまり（例「広告なしで150万回見られた動画」）を**言い換えずに**抜き出して上に出し、t を下に小さく出す
- facts：数字があれば等幅、無ければ見出し書体で unit は下の行。**520px以下は1列の表（項目名｜値）**にし、2行まで（3つ目以降は出さない）
- 料金（07）は `price.kind` で2通り
  - `fixed`：プランを横に並べる（1〜3列。狭い画面は縦）。金額は動かさない。`monitor` があれば下に帯。プランに `monitorAmount`（任意）を入れると「定価 → モニター」の2段になる
  - `quote`：「内容をうかがってお見積りします。金額は、次のことで決まります」＋ `factors` ＋ `notes`
  - どちらも最後に利用規約 第6条へのリンク
- スマホの固定バー：fixed は最安プランの金額（2つ以上なら「〜」）、quote は「お見積り」。**資料請求の欄が画面に入っている間と送信後は隠す**（入口を同時に2つ見せない）
- 動き：
  - FV（`data-fd` の要素・立方体の線・見出しの下線）は **CSS だけ**で出る。JS を待たない。約0.8秒で出そろう
  - JS が無いとき：page.tsx の `<noscript>` で2画面目以降の `.rv` も最初から表示（白紙にしない）
  - 立方体：pathLength=1 で長さを固定して CSS で描く。1041px以上はスクロールで分解、狭い画面は見出しの右上に小さく回り込ませて動かさない
  - 背景の格子：FV が見えている間だけ rAF で動かす。FV を過ぎた・裏のタブ（visibilitychange）では止める。620px以下は静止した1枚だけ描く
  - 進め方の線：項目は最初に1回だけ取得して使い回す
- 構造化データ（app/services/[slug]/page.tsx）：fixed はプランごとの `Offer`、quote は価格を載せない
- データを書くときの注意
  - `titleHighlight` は `title[1]` の中にそのまま含まれる語（無いと下線なしで表示）
  - `facts.unit` は12字以内が目安
  - `docPitch` は title 20字・items 4〜5個・各30字以内が目安。長いと低い画面でパネルが詰まる（landing-page は超えている）
  - voice は裏付けのあるものだけ（今は全ページ null）

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
- 確認：`npm run build` → `RESEND_API_KEY= npx next start -p 3011`（**メール送信キーを空にして起動**。.env.local に本物のキーがある）。画面は 1280×720／900×620／390×700 で見る。`/api/document`・`/api/contact` には POST しない


## 資料（PDF）の作り方

資料づくりの道具・各資料の作り・指示の正本（プロンプト）は、本社の `営業/提案資料/資料づくり/` にある（README.md と 資料づくりのプロンプト.md）。配る版のPDFは `営業/提案資料/サービス資料_<日付>/`。サイトに置くのは代表が見て確認してから。
