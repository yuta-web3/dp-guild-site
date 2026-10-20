import type { Metadata } from "next";
import Link from "next/link";
import LegalLayout, { legalRobots } from "@/components/LegalLayout";

// ドラフト元: 00_DP-GUILD本社/マーケティング/SNS運用/Instagram初期構築/利用規約_特商法_draft.md (v0.1)
// 住所・代表者は掲載、電話番号のみ請求時開示、価格は税別表記。
// 2026-10 改定：Instagram初期構築だけの表記から、会社全体（制作・SNS運用代行・立ち上げ・検証パッケージ）の表記に

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
              各サービスのページ、またはお見積りに表示します。価格はすべて<strong>税別表示</strong>です。別途消費税を申し受けます。
            </td>
          </tr>
          <tr>
            <th scope="row">商品代金以外の必要料金</th>
            <td>
              撮影を伴う場合の交通費・宿泊費（実費。お申込み前に概算をお伝えします）。銀行振込の場合は振込手数料。広告を出す場合の広告費（広告の会社へ直接お支払いいただきます）。
            </td>
          </tr>
          <tr>
            <th scope="row">支払方法</th>
            <td>クレジットカード／銀行振込</td>
          </tr>
          <tr>
            <th scope="row">支払時期</th>
            <td>
              制作（ホームページ・LP・ネットショップ・アプリ・システム）：ご契約時に着手金50%、納品時に残り50%
              <br />
              SNS運用代行：初期費用はご契約時、月額はその月の作業分を翌月末（後払い）
              <br />
              SNSの立ち上げだけのプラン・LPの検証パッケージ：お申込み時（前払い）
            </td>
          </tr>
          <tr>
            <th scope="row">提供時期</th>
            <td>
              制作：お見積りに記載した納期
              <br />
              SNS運用代行：ご契約の月から毎月（契約期間は6ヶ月から）
              <br />
              SNSの立ち上げだけのプラン：フィードは素材の受領後約1ヶ月、動画は撮影の実施後約1ヶ月で納品（納品30日後にレビューを実施）
            </td>
          </tr>
          <tr>
            <th scope="row">キャンセル・途中解約</th>
            <td>
              制作：途中で解約される場合は、それまでに行った作業の分を、当社が算出した金額でお支払いいただきます。
              <br />
              SNS運用代行：契約期間は6ヶ月からです。期間内に解約される場合は、残りの月の費用をお支払いいただきます。6ヶ月を過ぎたら、1ヶ月前のご連絡で解約できます。
              <br />
              SNSの立ち上げだけのプラン：キックオフ実施前は決済手数料を除き全額返金、キックオフ実施後・投稿3本のご確認前は50%返金、投稿3本のご確認後は返金いたしません。詳細は
              <Link href="/terms">利用規約</Link>第6条をご確認ください。
            </td>
          </tr>
          <tr>
            <th scope="row">不具合への対応</th>
            <td>
              制作物の不具合は、公開（納品）から30日間は無償で直します。案件の規模によっては、期間を別途ご相談して決めます。
            </td>
          </tr>
        </tbody>
      </table>
    </LegalLayout>
  );
}
