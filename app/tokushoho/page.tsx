import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { legalRobots } from "@/components/LegalLayout";

// ドラフト元: 00_DP-GUILD本社/マーケティング/SNS運用/Instagram初期構築/利用規約_特商法_draft.md (v0.1)
// 2026-09-06 石井さん確認済み。住所・代表者は掲載、電話番号のみ請求時開示、価格は税別表記。

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "株式会社DP-GUILDの特定商取引法に基づく表記です。",
  alternates: { canonical: "/tokushoho" },
  robots: legalRobots,
};

export default function TokushohoPage() {
  return (
    <LegalLayout title="特定商取引法に基づく表記" titleEn="Legal Notice">
      <table>
        <tbody>
          <tr>
            <th scope="row">販売事業者</th>
            <td>株式会社DP-GUILD</td>
          </tr>
          <tr>
            <th scope="row">代表者</th>
            <td>
              代表取締役 石井 勇多
            </td>
          </tr>
          <tr>
            <th scope="row">所在地</th>
            <td>
              〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9
            </td>
          </tr>
          <tr>
            <th scope="row">電話番号</th>
            <td>
              お取引・サービスに関するお問い合わせはメールにて承ります。電話番号はご請求があった場合、遅滞なく開示いたします。
            </td>
          </tr>
          <tr>
            <th scope="row">メールアドレス</th>
            <td>
              <a href="mailto:info@dp-guild.com">info@dp-guild.com</a>
            </td>
          </tr>
          <tr>
            <th scope="row">販売価格</th>
            <td>
              各サービスの申込ページに表示します。価格はすべて<strong>税別表示</strong>です。別途消費税を申し受けます。
            </td>
          </tr>
          <tr>
            <th scope="row">商品代金以外の必要料金</th>
            <td>
              撮影を伴うプランは交通費・宿泊費（実費・お申込み前に概算提示）。銀行振込の場合は振込手数料。
            </td>
          </tr>
          <tr>
            <th scope="row">支払方法</th>
            <td>クレジットカード／銀行振込</td>
          </tr>
          <tr>
            <th scope="row">支払時期</th>
            <td>お申込み時（前払い）</td>
          </tr>
          <tr>
            <th scope="row">提供時期</th>
            <td>
              フィードプラン: 素材受領後約1ヶ月以内に納品／動画プラン:
              撮影実施後約1ヶ月以内に納品（納品30日後にレビューを実施）
            </td>
          </tr>
          <tr>
            <th scope="row">返品・キャンセル</th>
            <td>
              お客様都合によるキャンセルは、進行段階に応じて取り扱います。キックオフ実施前は決済手数料を除き全額返金、キックオフ実施後・投稿3本のご確認前は50%返金、投稿3本のご確認後は返金いたしません。詳細は
              <Link href="/terms">利用規約</Link>第6条をご確認ください。
            </td>
          </tr>
        </tbody>
      </table>
    </LegalLayout>
  );
}
