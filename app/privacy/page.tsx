import type { Metadata } from "next";
import LegalLayout, { legalRobots } from "@/components/LegalLayout";

// 新規作成（既存サイトにプラポリなし・404確認済み 2026-08-21）
// 2026-09-06 石井さん確認済み。外国移転は国名＋PPC参照リンクを明記して公開可の状態。

const ENACTED_DATE: string | null = "2026年9月6日";
// 2026-09-30 改定：Microsoft Clarity（ページ内の操作の分析）を追記
// 2026-09-27 改定：Instagramからのご相談（経路・投稿の記録）、Instagramでのメッセージ、広告の効果測定（Meta）、メール送信（Resend）を追記
const REVISED_DATE = "2026年9月30日";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "株式会社DP-GUILDのプライバシーポリシー（個人情報保護方針）です。",
  alternates: { canonical: "/privacy" },
  robots: legalRobots,
};

export default function PrivacyPage() {
  return (
    <LegalLayout
      title="プライバシーポリシー"
      updatedAt={ENACTED_DATE ? `制定日: ${ENACTED_DATE} ／ 改定日: ${REVISED_DATE}` : undefined}
    >
      <p>
        株式会社DP-GUILD（以下「当社」）は、当社のウェブサイト（dp-guild.com）およびサービスの提供にあたり、お客様の個人情報を以下の方針に基づき取り扱います。
      </p>

      <h2>1. 取得する情報</h2>
      <p>当社は、次の場面でお客様の情報を取得します。</p>
      <ul>
        <li>
          <strong>お問い合わせフォーム</strong>
          ：お名前、メールアドレス、会社名・屋号、ご相談内容
        </li>
        <li>
          <strong>Instagramからのご相談</strong>
          ：当社のInstagramの投稿やメッセージからご相談ページにお越しいただいた場合の、お越しいただいた経路（プロフィール、メッセージ、広告の別）と投稿を示す情報（ページのURLに含まれる情報）、および最初に開いたページのURL。これらはご相談の内容と合わせて記録します。
        </li>
        <li>
          <strong>Instagramでのコメント・メッセージ</strong>
          ：当社アカウントの投稿にコメントいただいた方へ、ご案内のメッセージをお送りすることがあります。その際、Instagramのユーザー名、コメントおよびメッセージの内容を取得します。
        </li>
        <li>
          <strong>サービスのお申込み・決済</strong>
          ：お名前、メールアドレス、請求先情報等（クレジットカード情報は決済代行会社Stripeが取り扱い、当社はカード番号を保持しません）
        </li>
        <li>
          <strong>相談のご予約</strong>
          ：予約サービス（TimeRex）を通じてご入力いただく情報
        </li>
        <li>
          <strong>アクセス解析</strong>
          ：Cookie等を用いたアクセス情報（Google Analyticsを利用）、およびページ内での操作の記録（スクロール・クリック等。Microsoft Clarityを利用）。また、広告の効果測定のため、Meta Platforms, Inc.が提供する計測ツールを利用する場合があります。これらは単体では特定の個人を識別できない情報ですが、他の情報と組み合わせて識別できる場合には、個人情報として取り扱います。
        </li>
      </ul>

      <h2>2. 利用目的</h2>
      <p>取得した個人情報は、次の目的で利用します。</p>
      <ul>
        <li>お問い合わせ・ご相談への回答、日程調整等のご連絡</li>
        <li>サービスの提供、納品物の送付、代金の請求・決済</li>
        <li>サービスに関する重要なお知らせの送付</li>
        <li>
          当社サービスのご案内（納品後のレビュー・関連サービスのご提案を含みます）
        </li>
        <li>サイトの利便性向上・コンテンツ改善のための分析</li>
        <li>
          当社の投稿・広告の効果の測定と改善（どの経路・投稿からご相談いただいたかの集計を含みます）
        </li>
      </ul>

      <h2>3. 第三者提供</h2>
      <p>
        当社は、法令に基づく場合を除き、ご本人の同意なく個人情報を第三者に提供しません。
      </p>

      <h2>4. 外部サービスの利用（外国にある第三者への提供を含む）</h2>
      <p>
        当社は、業務に必要な範囲で次の外部サービスを利用しており、各サービスの提供者に個人情報の取り扱いの一部を委託する場合があります。このうち一部は外国にある事業者であり、当社は個人データを当該事業者に提供することがあります。
      </p>
      <table>
        <thead>
          <tr>
            <th scope="col">利用目的</th>
            <th scope="col">提供先の事業者</th>
            <th scope="col" style={{ whiteSpace: "nowrap" }}>所在国</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>決済処理</td>
            <td>Stripe, Inc.</td>
            <td style={{ whiteSpace: "nowrap" }}>アメリカ合衆国</td>
          </tr>
          <tr>
            <td>アクセス解析</td>
            <td>Google LLC</td>
            <td style={{ whiteSpace: "nowrap" }}>アメリカ合衆国</td>
          </tr>
          <tr>
            <td>ページ内の操作の分析（ヒートマップ等）</td>
            <td>Microsoft Corporation</td>
            <td style={{ whiteSpace: "nowrap" }}>アメリカ合衆国</td>
          </tr>
          <tr>
            <td>メールの送信（自動返信・社内への通知）</td>
            <td>Resend（メール配信サービスの提供事業者）</td>
            <td style={{ whiteSpace: "nowrap" }}>アメリカ合衆国</td>
          </tr>
          <tr>
            <td>広告の効果測定、Instagramでのメッセージの送受信</td>
            <td>Meta Platforms, Inc.</td>
            <td style={{ whiteSpace: "nowrap" }}>アメリカ合衆国</td>
          </tr>
          <tr>
            <td>日程調整</td>
            <td>株式会社TimeRex</td>
            <td style={{ whiteSpace: "nowrap" }}>日本</td>
          </tr>
        </tbody>
      </table>
      <p>
        アメリカ合衆国における個人情報の保護に関する制度については、個人情報保護委員会が公表している
        <a
          href="https://www.ppc.go.jp/personalinfo/legal/kaiseihogohou/#gaikoku"
          target="_blank"
          rel="noopener noreferrer"
        >
          外国における個人情報の保護に関する制度等の調査結果
        </a>
        をご参照ください。各事業者が講じる個人情報保護のための措置については、それぞれのプライバシーポリシーをご確認ください。
      </p>

      <h2>5. Cookieの利用</h2>
      <p>
        当サイトでは、アクセス解析および広告の効果測定のためにCookie等を利用しています。ブラウザの設定によりCookieを無効にすることができますが、その場合も当サイトの閲覧に支障はありません。
      </p>

      <h2>6. 安全管理</h2>
      <p>
        当社は、個人情報の漏えい・滅失・毀損を防止するため、適切な安全管理措置を講じます。
      </p>

      <h2>7. 開示・訂正・削除のご請求</h2>
      <p>
        ご本人からの個人情報の開示・訂正・利用停止・削除のご請求には、ご本人であることを確認のうえ、法令に従い速やかに対応します。下記の窓口までご連絡ください。
      </p>

      <h2>8. 本ポリシーの改定</h2>
      <p>
        本ポリシーの内容は、法令の変更やサービス内容の変更に応じて改定することがあります。改定した場合は、当サイトに掲載した時点から適用されます。
      </p>

      <h2>9. お問い合わせ窓口</h2>
      <p>
        株式会社DP-GUILD
        <br />
        〒520-3333 滋賀県甲賀市甲南町希望ケ丘3丁目12-9
        <br />
        メール：<a href="mailto:info@dp-guild.com">info@dp-guild.com</a>
      </p>
    </LegalLayout>
  );
}
