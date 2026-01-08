'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, GitBranch, XCircle, CheckCircle, TrendingUp } from 'lucide-react';
import Header from '@/components/Header';

export default function ResultsPage() {
  // 判断ログデータ
  const judgmentCases = [
    {
      id: "01",
      client: "製造業（醸造業者）",
      consultation: "在庫管理が非効率で、顧客満足度も上げたいが、予算が限られている",
      options: [
        "A：高機能な在庫管理システム（月額5万円〜）",
        "B：シンプルな在庫管理＋Wi-Fi環境整備",
        "C：SNSマーケティングに全振り"
      ],
      rejected: "A（高機能システム）：機能の8割は使わない見込み。運用負荷が増えるリスク",
      finalDecision: "Bを基盤に、余った予算でCを小規模実施",
      reason: "まず業務効率化で時間を確保し、その上でマーケティングに取り組む順序が現実的と判断",
      after: "在庫ロス減少、リピーター増加。浮いた時間でSNS運用が継続できている"
    },
    {
      id: "02",
      client: "サービス業（ストレッチスタジオ）",
      consultation: "新規開業。予算が限られている中で集客と信頼性を両立したい",
      options: [
        "A：フル機能のコーポレートサイト＋予約システム",
        "B：必要最低限のサイト＋外部予約サービス連携",
        "C：SNSのみで集客"
      ],
      rejected: "A（フル機能サイト）：開業直後は予約数も読めない。過剰投資のリスク",
      finalDecision: "Bを選択。サイトはシンプルに、予約は実績ある外部サービスを活用",
      reason: "信頼性は「サイトがあること」で担保できる。機能は軌道に乗ってから追加すればいい",
      after: "集客力向上、リピーター獲得。予算内で安定経営の基盤ができた"
    },
    {
      id: "03",
      client: "製造業（忍者服工房）",
      consultation: "伝統的な忍者服をECで販売したいが、どこまで作り込むべきか迷っている",
      options: [
        "A：Shopify等の既存プラットフォーム活用",
        "B：フルスクラッチでオリジナルEC構築",
        "C：まずはBASE等の無料サービスで様子見"
      ],
      rejected: "A（既存プラットフォーム）：テンプレートでは商品の世界観を表現しきれない",
      finalDecision: "Bを選択。商品の魅力を最大限伝えるシンプル設計でフルスクラッチ",
      reason: "「忍者服」という唯一無二の商品には、唯一無二の見せ方が必要と判断",
      after: "訪問者数・売上の増加。商品の世界観が伝わり、ファンが定着"
    },
    {
      id: "04",
      client: "医療（リハビリ業者）",
      consultation: "脳疾患特化型リハビリの認知が低い。Web集客を強化したいが何から手をつけるべきか",
      options: [
        "A：広告に予算を集中投下",
        "B：LP構築＋SEO対策の地道な改善",
        "C：SNSでの認知拡大"
      ],
      rejected: "A（広告集中）：認知がない状態で広告を打っても、受け皿（LP）がなければ無駄になる",
      finalDecision: "Bを選択。まずLPで信頼感を醸成し、SEOで検索経由の流入を確保",
      reason: "「脳疾患 リハビリ」で検索する人は本気度が高い。その人に刺さるLPが先",
      after: "Web問い合わせ大幅増加、コンバージョン率向上。広告は次のフェーズで検討中"
    },
    {
      id: "05",
      client: "教育（デザインスクール）",
      consultation: "Instagram活用で認知を広げたいが、どんなコンテンツが効果的かわからない",
      options: [
        "A：受講生の作品紹介を中心に投稿",
        "B：教育コンテンツの動画化でバイラルを狙う",
        "C：広告中心で認知拡大"
      ],
      rejected: "A（作品紹介）：フォロワー外へのリーチが限定的。認知拡大には弱い",
      finalDecision: "Bを選択。学びになる動画コンテンツで自然な拡散を狙う",
      reason: "「教えてくれる」コンテンツはシェアされやすい。広告費なしで認知を取れる可能性",
      after: "動画1,600万回再生達成。広告なしで受講生獲得が大幅増加"
    },
    {
      id: "06",
      client: "製造業（大手食品メーカー）",
      consultation: "データドリブンマーケティングを始めたいが、どのベンダーを選べばいいかわからない",
      options: [
        "A：知名度の高い大手ベンダーに依頼",
        "B：要件を明確にしてから複数ベンダーを比較選定",
        "C：社内で内製化"
      ],
      rejected: "A（大手一択）：要件が曖昧なまま発注すると、後から「こうじゃなかった」が発生",
      finalDecision: "Bを選択。まず要求定義を策定し、RFP作成後に複数社を比較",
      reason: "「何がしたいか」を言語化してから選ばないと、ベンダーの提案が正しいか判断できない",
      after: "最適なベンダー選定成功。要件に合ったシステム導入でマーケティング精度向上"
    }
  ];

  return (
    <div className="font-sans text-gray-900 bg-white">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[40vh] flex items-center bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#334155] pt-32 pb-16">
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <motion.div
            className="max-w-4xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              判断の記録
            </h1>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              「何を選び、何を選ばなかったか」<br className="hidden md:block" />
              お客様と一緒に考えた判断プロセスを公開しています。
            </p>
          </motion.div>
        </div>
      </section>

      {/* 判断ログセクション */}
      <section className="py-16 md:py-20 bg-white">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="space-y-16">
            {judgmentCases.map((caseItem, index) => (
              <motion.article
                key={caseItem.id}
                className="border-b border-gray-200 pb-16 last:border-b-0"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-sm font-bold text-white bg-[#0F172A] px-3 py-1 rounded">
                    判断事例 {caseItem.id}
                  </span>
                  <span className="text-sm text-gray-500">{caseItem.client}</span>
                </div>

                {/* 相談内容 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageCircle className="w-5 h-5 text-[#0F172A]" />
                    <span className="font-bold text-[#0F172A]">相談内容</span>
                  </div>
                  <p className="text-gray-700 pl-7">「{caseItem.consultation}」</p>
                </div>

                {/* 検討した選択肢 */}
                <div className="mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="w-5 h-5 text-[#0F172A]" />
                    <span className="font-bold text-[#0F172A]">検討した選択肢</span>
                  </div>
                  <ul className="space-y-2 pl-7">
                    {caseItem.options.map((option, optIndex) => (
                      <li key={optIndex} className="text-gray-700">{option}</li>
                    ))}
                  </ul>
                </div>

                {/* やらなかった判断 */}
                <div className="mb-6 bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-gray-500" />
                    <span className="font-bold text-gray-700">やらなかった判断</span>
                  </div>
                  <p className="text-gray-600 pl-7">{caseItem.rejected}</p>
                </div>

                {/* 最終判断 */}
                <div className="mb-6 bg-[#F0F4F8] border border-[#0F172A]/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="w-5 h-5 text-[#0F172A]" />
                    <span className="font-bold text-[#0F172A]">最終判断</span>
                  </div>
                  <p className="text-gray-700 pl-7 font-medium">{caseItem.finalDecision}</p>
                  <p className="text-gray-600 pl-7 mt-2 text-sm">理由：{caseItem.reason}</p>
                </div>

                {/* その後 */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-[#0F172A]" />
                    <span className="font-bold text-[#0F172A]">その後</span>
                  </div>
                  <p className="text-gray-700 pl-7">{caseItem.after}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 bg-[#F8FAFC]">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] mb-6">
            あなたの状況を整理しませんか？
          </h2>
          <p className="text-gray-600 mb-8">
            「どれが正解かわからない」状態から、<br className="hidden md:block" />
            「この判断でいこう」と言える状態へ。<br className="hidden md:block" />
            まず30分、一緒に選択肢を整理します。
          </p>
          <a
            href="https://timerex.net/s/info_f990_429a/709e9191"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 bg-[#0F172A] text-white rounded-md font-medium hover:bg-[#1e293b] transition-colors"
          >
            相談を予約する
            <ArrowRight className="w-5 h-5 ml-2" />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0F172A] py-12">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <span className="text-xl font-bold text-white">DP-GUILD</span>
            </div>
            <nav className="flex space-x-6 text-sm text-gray-400">
              <Link href="/" className="hover:text-white transition-colors">ホーム</Link>
              <Link href="/about" className="hover:text-white transition-colors">会社概要</Link>
              <Link href="/results" className="hover:text-white transition-colors">判断の記録</Link>
              <Link href="/blog" className="hover:text-white transition-colors">ブログ</Link>
              <Link href="/contact" className="hover:text-white transition-colors">お問い合わせ</Link>
            </nav>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} DP-GUILD Inc. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
